import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { updateReminderDto } from './dto/update-reminder.dto';
import { DataResponseDto, DEFAULT_PAGE, DEFAULT_PAGE_LIMIT, ErrorMessage, PaginationDto, PermissionService, SuccessMessage } from 'src/common';
import { ReminderMapperService } from './mapper/reminder-mapper.service';
import { ResponseReminderDto } from './dto/response-reminder.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/users.entity';


@Injectable()
export class RemindersService {
  constructor(@InjectRepository(Reminder) private readonly reminderRepository: Repository<Reminder>,
              private readonly userService: UsersService,
              private readonly reminderMapperService: ReminderMapperService,
              private readonly permissionService: PermissionService) {}



  public async createReminder(currentUserId: string, {userId, ...createReminder}: CreateReminderDto): Promise<DataResponseDto<ResponseReminderDto>> {

   this.permissionService.verifyUser(currentUserId, userId);
      const userCreator: User = await this.userService.findUserById(currentUserId);
      
      const newReminder = this.reminderRepository.create({...createReminder, user: userCreator});
      return {
          message: SuccessMessage.OBJECT_SUCCESS_ACCTION('reminder', 'created'),
            data: {
              content: this.reminderMapperService.toResponseReminder(await this.reminderRepository.save(newReminder))
            }
        }
  }


  private async findReminderById(reminderId: string): Promise<ResponseReminderDto> {
    if (!isUUID(reminderId)) throw new NotFoundException(ErrorMessage.OBJECT_NOT_FOUND('reminder', reminderId));
      const reminderFound = await this.reminderRepository.findOne({
        where: {id: reminderId},
        loadRelationIds: true
      });

      if (!reminderFound) throw new NotFoundException(ErrorMessage.OBJECT_NOT_FOUND('reminder', reminderId));
      return this.reminderMapperService.toResponseReminder(reminderFound);
  }


  public async getRemindersUser(userId: string, {page, limit}: PaginationDto): Promise<DataResponseDto<ResponseReminderDto[]>> {
        page = page ?? DEFAULT_PAGE;
        limit = limit ?? DEFAULT_PAGE_LIMIT;

        const userRemindersAndCount: [Reminder[], number] = await this.reminderRepository.findAndCount({
          where: {user: {id: userId}},
          skip: (page - 1) * limit,
          take: limit,
          loadRelationIds: true
        });

        const totalData: number = userRemindersAndCount[1];
        if  (totalData === 0) {
            if (page > 1) throw new NotFoundException()
            return {
              data: {content: []}
              }
        }

            const totalPages: number = Math.ceil(totalData / limit);
            if (page > totalPages) throw new NotFoundException();

            const userResponseReminders: ResponseReminderDto[] = userRemindersAndCount[0].map(reminder =>
               this.reminderMapperService.toResponseReminder(reminder));

            return {
                data: {
                  content: userResponseReminders,
                  metadata: {
                    totalPages: totalPages,
                    currentPage: page,
                    limit: limit
                  }
                }
            }
    }

  

  public async updateReminder(currentUserId: string, reminderId: string, updateReminderDto: updateReminderDto): Promise<DataResponseDto<ResponseReminderDto>> {
    if (Object.keys(updateReminderDto).length == 0) throw new BadRequestException(ErrorMessage.DATA_NOT_EMPTY);
    const reminderToUpdate = await this.findReminderById(reminderId);
  
    this.permissionService.verifyUser(currentUserId, reminderToUpdate.userId);

      const updated = await this.reminderRepository
            .createQueryBuilder()
            .update(Reminder)
            .set(updateReminderDto)
            .where("reminders.id = :id", { id: reminderId })
            .execute();
        
            if (updated.affected) return {
              message: SuccessMessage.OBJECT_SUCCESS_ACCTION('reminder', 'updated', reminderId),
              data: {
                  content: await this.findReminderById(reminderId)
              }
          };

          throw new InternalServerErrorException(ErrorMessage.OPERATION_FAILED_ERROR);
  }
  


  public async deleteReminder(currentUserId: string, reminderId: string): Promise<DataResponseDto<void>> {
    const reminderToDelete: ResponseReminderDto = await this.findReminderById(reminderId);
    this.permissionService.verifyUser(currentUserId, reminderToDelete.userId)

    const deleteResult = await this.reminderRepository
          .createQueryBuilder()
          .delete()
          .from(Reminder, 'reminders')
          .where('reminders.id = :id', {id: reminderId})
          .execute()
          
          if (deleteResult.affected) {
            return {
              message: SuccessMessage.OBJECT_SUCCESS_ACCTION('reminder', 'deleted'),
              data: null
            }
          }

          throw new InternalServerErrorException(ErrorMessage.OPERATION_FAILED_ERROR);
    }

}

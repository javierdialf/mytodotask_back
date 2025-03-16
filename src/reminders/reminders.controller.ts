import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { updateReminderDto } from './dto/update-reminder.dto';
import { HttpCode,HttpStatus } from '@nestjs/common';
import { getCurrentUserId } from 'src/auth/decorators/getCurrentUserId.decorator';
import { DataResponseDto, PaginationDto} from 'src/common';
import { ResponseReminderDto } from './dto/response-reminder.dto';


@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/create')
  public async create(@getCurrentUserId() currentUserId: string, @Body() reminder: CreateReminderDto): Promise<DataResponseDto<ResponseReminderDto>> {
    return await this.remindersService.createReminder(currentUserId, reminder);
  }

  @Get('/remindersUser')
  @UsePipes(new ValidationPipe({transform: true}))
  public async getRemindersUser(@getCurrentUserId() userId: string, @Query() paginationDto: PaginationDto): Promise<DataResponseDto<ResponseReminderDto[]>> {
    return await this.remindersService.getRemindersUser(userId, paginationDto);
  }

  @Patch('/update/:id')
  public async update(@getCurrentUserId() currentUserId: string, @Param('id') reminderId: string, @Body() dataUpdate: updateReminderDto): Promise<DataResponseDto<ResponseReminderDto>> {
    return await this.remindersService.updateReminder(currentUserId,reminderId, dataUpdate);
  }

  @Delete('/delete/:id')
  public async delete(@getCurrentUserId() currentUserId: string, @Param('id') reminderId: string): Promise<DataResponseDto<void>> {
    return await this.remindersService.deleteReminder(currentUserId, reminderId);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trash } from './entities/trash.entity';
import { Repository } from 'typeorm';
import { Note } from 'src/notes/entities/notes.entity';
import { ConflictException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { NotFoundException } from '@nestjs/common';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { DeleteResult } from 'typeorm';

@Injectable()
export class TrashService {
    constructor(@InjectRepository(Trash) private trashRepository: Repository<Trash>) {}

    async findInTrashById(dataId: string): Promise<Reminder | Note | null> {
      if (!isUUID(dataId)) return null;
        const data = await this.trashRepository
          .createQueryBuilder('data')
          .select('*')
          .where('data.id = :id', {id: dataId})
          .getRawOne();
  
        if(!data) throw new NotFoundException('file not found');
  
          return {
              userId: data.user_id,
              ...data
          };
    }


    async getUserTrash(currentUserId: string):Promise<Trash[]> {
      const trashUser: Trash[] = await this.trashRepository
          .createQueryBuilder()
          .select('trash')
          .from(Trash, 'trash')
          .where('trash.user_id = :user_id', {user_id: currentUserId})
          .getMany();

          if(!trashUser) throw new NotFoundException('user has empty trash');
              return trashUser;
    }
    

    async verifyUser(currentUserId, dataUserId) {
      if (currentUserId != dataUserId) throw new ConflictException('Access denied for this action');
  }

    
  async restoreData(currentUserId: string, dataId: string): Promise<DeleteResult> {
    const data: Note | Reminder = await this.findInTrashById(dataId);
      await this.verifyUser(currentUserId, data.user.id);

        return await this.trashRepository
          .createQueryBuilder()
          .delete()
          .where({id: dataId})
          .execute();
  }
}

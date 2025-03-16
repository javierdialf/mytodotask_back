import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';
import { TrashModule } from 'src/trash/trash.module';
import { ReminderMapperService } from './mapper/reminder-mapper.service';
import { UsersModule } from 'src/users/users.module';
import { PermissionService } from 'src/common';

@Module({
  imports: [TypeOrmModule.forFeature([Reminder]), TrashModule, UsersModule],
  controllers: [RemindersController],
  providers: [RemindersService, ReminderMapperService, PermissionService],
})
export class RemindersModule {}

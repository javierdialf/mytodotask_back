import { Injectable } from "@nestjs/common";
import { Reminder } from "../entities/reminder.entity";
import { User } from "src/users/entities/users.entity";
import { ResponseReminderDto } from "../dto/response-reminder.dto";

@Injectable()
export class ReminderMapperService  {

    public toResponseReminder({user, ...reminder}: Reminder): ResponseReminderDto {
        return {
            ...reminder,
            userId: user instanceof User ? user.id : user
        }
    }
}
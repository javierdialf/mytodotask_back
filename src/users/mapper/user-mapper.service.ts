import { Injectable } from "@nestjs/common";
import { User } from "../entities/users.entity";
import { ResponseUserDto } from "../dto/response-user.dto";

@Injectable()
export class UserMapperService {
    
    public toUserResponse({notes, reminders, password, ...user}: User): ResponseUserDto {
        return {
            ...user
        }
    }   
}
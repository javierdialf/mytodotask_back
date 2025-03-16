import { ResponseUserDto } from "src/users/dto/response-user.dto";

export class ResponseLoginDto {
    access_token: string;
    user: ResponseUserDto;
}
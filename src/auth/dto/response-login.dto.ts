import { ResponseUserDto } from "src/users/dto/response-user.dto";

export class LoginResponseDto {
    accessToken: string;
    user: ResponseUserDto;
}
import { IsNotEmpty, IsString, Length} from "class-validator";

export class ChangePasswordDto {
    @IsString()
    @Length(6,16)
    @IsNotEmpty()
    oldPassword: string;


    @IsString()
    @Length(6,16)
    @IsNotEmpty()
    newPassword: string;
}
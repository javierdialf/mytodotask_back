import { IsEmail, IsNotEmpty, Length, Matches } from "class-validator";
import { ErrorMessage } from "src/common";
import { INSTITUCIONAL_EMAIL_REGEX } from "src/common/constants/regex.contants";

export class credentialUserDto {
 
    @IsEmail()
    @IsNotEmpty()
    @Matches(INSTITUCIONAL_EMAIL_REGEX, {message: ErrorMessage.ONLY_INSTITUTIONAL_EMAILS})
    email: string;

    @IsNotEmpty()
    @Length(2,14)
    password: string;
}
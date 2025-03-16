import { IsEmail, IsNotEmpty, IsString, Length, Matches} from "class-validator";
import { ErrorMessage } from "src/common";
import { INSTITUCIONAL_EMAIL_REGEX } from "src/common/constants/regex.contants";

export class createUserDto {

    @IsString()
    @Length(2,25)
    @IsNotEmpty()
    @Matches(/^[A-Za-z\s]+$/, { message: 'The name must contain only letters and spaces.' })
    name: string;


    @IsString()
    @Length(2,25)
    @IsNotEmpty()
    @Matches(/^[A-Za-z\s]+$/, { message: 'The lastname must contain only letters and spaces..' })
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    @Matches(INSTITUCIONAL_EMAIL_REGEX, {message: ErrorMessage.ONLY_INSTITUTIONAL_EMAILS})
    email: string;

    @IsString()
    @Length(6, 16)
    @IsNotEmpty()
    password: string;
}
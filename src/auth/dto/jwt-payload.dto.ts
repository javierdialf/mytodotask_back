import { IsEmail, IsNotEmpty, IsUUID, Matches } from "class-validator";
import { ErrorMessage } from "src/common";
import { INSTITUCIONAL_EMAIL_REGEX } from "src/common/constants/regex.contants";

export class jwtPayloadDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    @IsEmail()
    @Matches(INSTITUCIONAL_EMAIL_REGEX, {message: ErrorMessage.ONLY_INSTITUTIONAL_EMAILS})
    sub: string;
}
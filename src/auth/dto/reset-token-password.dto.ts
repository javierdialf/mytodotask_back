import { Expose } from "class-transformer";
import { IsString } from "class-validator";
import { NAMES } from "src/common/constants/names.constants";

export class ResetTokenPasswordDto {
    @Expose({name: NAMES.RESET_PASSWORD_TOKEN})
    @IsString()
    resetToken: string;
}
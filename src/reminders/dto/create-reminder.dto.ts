import { Type } from "class-transformer";
import {IsDate, IsNotEmpty, IsOptional, IsString, IsUUID, MinDate } from "class-validator";

export class CreateReminderDto {
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    @IsOptional()
    contenido?: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    @MinDate(new Date(), {message: 'fechaRecordatorio should be later than current date'})
    fechaRecordatorio: Date;

    @IsUUID()
    @IsNotEmpty()
    userId: string
}

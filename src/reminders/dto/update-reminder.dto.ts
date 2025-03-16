import { IsNotEmpty, IsString, IsOptional, IsDate} from 'class-validator';

export class updateReminderDto {
    @IsString()
    @IsNotEmpty()
    titulo?: string;

    @IsString()
    @IsOptional()
    contenido?: string;

    @IsDate()
    @IsOptional()
    fechaRecordatorio?: Date;
}

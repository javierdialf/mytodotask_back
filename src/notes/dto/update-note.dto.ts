import { IsString, IsOptional, Length, IsNotEmpty} from "class-validator";

export class UpdateNoteDto {
    @IsString()
    @Length(1,35)
    @IsOptional()
    @IsNotEmpty()
    titulo:string;

    @IsOptional()
    @IsString()
    @Length(1,4000)
    contenido: string;
}
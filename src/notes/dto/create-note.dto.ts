import { IsNotEmpty, IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CreateNoteDto{

    @IsString()
    @Length(1,35)
    @IsNotEmpty()
    titulo:string;

    @IsOptional()
    @IsString()
    @Length(1,4000)
    contenido: string;

    @IsUUID()
    @IsNotEmpty()
    userId: string;
}
import { IsString, Matches, Length, IsNotEmpty, IsOptional } from "class-validator";

export class updateUserDto {
    @IsString()
    @Length(2,25)
    @IsOptional()
    @Matches(/^[A-Za-z\s]+$/, { message: 'El Nombre solo debe contener letras y espacios.' })
    name: string;


    @IsString()
    @Length(2,25)
    @IsOptional()
    @Matches(/^[A-Za-z\s]+$/, { message: 'El Apellido solo debe contener letras y espacios.' })
    lastName: string;


    @IsOptional()
    @Length(1,250)
    @IsString()
    photo: string;
}
import { IsNumber, IsOptional, IsPositive } from "class-validator";
import {Type} from "class-transformer";

export class PaginationDto {
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, {message: "page attribute should be a number"})
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, {message: 'limit attribute should be a number'})
    limit?: number;
}
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateProjectDto {
    @Length(4, 40)
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNotEmpty()
    @IsDateString()
    begin: Date;

    @IsBoolean()
    @IsOptional()
    active?: boolean;

    @IsNotEmpty()
    @IsDateString()
    @IsOptional()
    end?: Date;

}

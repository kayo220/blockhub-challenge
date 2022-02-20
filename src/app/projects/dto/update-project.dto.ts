import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @Length(4, 40)
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNotEmpty()
    @IsDateString()
    @IsOptional()
    begin: Date;

    @IsBoolean()
    @IsOptional()
    active?: boolean;

    @IsNotEmpty()
    @IsDateString()
    @IsOptional()
    end?: Date;
}

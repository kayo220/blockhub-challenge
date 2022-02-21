import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @Length(4, 40)
    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, minimum: 2, maximum: 100 })
    name?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    description?: string;

    @IsNotEmpty()
    @IsDateString()
    @IsOptional()
    @ApiProperty({ required: false })
    begin?: Date;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false })
    active?: boolean;

    @IsNotEmpty()
    @IsDateString()
    @IsOptional()
    @ApiProperty({ required: false })
    end?: Date;
}

import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty, IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { CreateCollaboratorDto } from './create-collaborator.dto';

export class UpdateCollaboratorDto extends PartialType(CreateCollaboratorDto) {
    @IsString()
    @Length(4, 100)
    @ApiProperty({ required: false, minimum: 4, maximum: 100 })
    name?: string;

    @IsString()
    @Length(2, 100)
    @ApiProperty({ required: false, minimum: 2, maximum: 100 })
    role?: string;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty({ required: false })
    admission?: Date;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false })
    active?: boolean
}

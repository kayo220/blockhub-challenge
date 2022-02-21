import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString } from 'class-validator';
import { CreateCollaboratorsProjectDto } from './create-collaborators-project.dto';

export class UpdateCollaboratorsProjectDto extends PartialType(CreateCollaboratorsProjectDto) {
    @IsNotEmpty()
    @IsDateString()
    @ApiProperty()
    begin: Date;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty()
    end: Date;
}

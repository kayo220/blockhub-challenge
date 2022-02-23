import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString, Validate } from 'class-validator';
import { IsBeforeConstraint } from '../../../helpers/decorator.date.helper';
import { CreateCollaboratorsProjectDto } from './create-collaborators-project.dto';

export class UpdateCollaboratorsProjectDto extends PartialType(CreateCollaboratorsProjectDto) {
    @IsNotEmpty()
    @IsDateString()
    @ApiProperty()
    @Validate(IsBeforeConstraint, ['end'])
    begin: Date;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty()
    end: Date;
}

import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsDateString } from 'class-validator';
import { CreateCollaboratorsProjectDto } from './create-collaborators-project.dto';

export class UpdateCollaboratorsProjectDto extends PartialType(CreateCollaboratorsProjectDto) {
    @IsNotEmpty()
    @IsDateString()
    begin: Date;

    @IsNotEmpty()
    @IsDateString()
    end: Date;
}

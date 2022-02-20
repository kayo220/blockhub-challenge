import { PartialType } from '@nestjs/mapped-types';
import { IsString, Length, IsNotEmpty, IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { CreateCollaboratorDto } from './create-collaborator.dto';

export class UpdateCollaboratorDto extends PartialType(CreateCollaboratorDto) {
    @IsString()
    @Length(4, 100)
    @IsOptional()
    name: string;

    @IsString()
    @Length(2, 100)
    @IsOptional()
    role: string;

    @IsNotEmpty()
    @IsDateString()
    @IsOptional()
    admission: Date;

    @IsBoolean()
    @IsOptional()
    active?: boolean
}

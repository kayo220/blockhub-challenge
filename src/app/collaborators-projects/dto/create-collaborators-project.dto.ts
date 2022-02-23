import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsDateString, IsOptional, Validate } from "class-validator";
import { IsBeforeConstraint } from "../../../helpers/decorator.date.helper";

export class CreateCollaboratorsProjectDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    project_id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    collaborator_id: string;

    @IsNotEmpty()
    @IsDateString()
    @Validate(IsBeforeConstraint, ['end'])
    @ApiProperty()
    begin: Date;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty()
    end: Date;

}

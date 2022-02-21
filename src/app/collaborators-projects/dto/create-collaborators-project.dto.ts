import { IsString, IsNotEmpty, IsDateString, IsOptional } from "class-validator";

export class CreateCollaboratorsProjectDto {
    @IsString()
    @IsNotEmpty()
    project_id: string;

    @IsString()
    @IsNotEmpty()
    collaborator_id: string;

    @IsNotEmpty()
    @IsDateString()
    begin: Date;

    @IsNotEmpty()
    @IsDateString()
    end: Date;

}

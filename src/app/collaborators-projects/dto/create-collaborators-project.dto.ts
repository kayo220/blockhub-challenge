import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsDateString, IsOptional } from "class-validator";

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
    @ApiProperty()
    begin: Date;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty()
    end: Date;

}

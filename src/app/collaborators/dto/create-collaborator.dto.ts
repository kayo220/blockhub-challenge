import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateCollaboratorDto {
    @IsString()
    @Length(4, 100)
    name: string;

    @IsString()
    @Length(2, 100)
    role: string;

    @IsNotEmpty()
    @IsDateString()
    admission: Date;

    @IsBoolean()
    @IsOptional()
    active?: boolean
}

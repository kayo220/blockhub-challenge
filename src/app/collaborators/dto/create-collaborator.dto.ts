import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateCollaboratorDto {
    @ApiProperty({ minimum: 4, maximum: 100 })
    @IsString()
    @Length(4, 100)
    name: string;

    @ApiProperty({minimum: 2, maximum: 100})
    @IsString()
    @Length(2, 100)
    role: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    admission: Date;

    @ApiProperty({ required: false, default: true })
    @IsBoolean()
    @IsOptional()
    active ?: boolean
}

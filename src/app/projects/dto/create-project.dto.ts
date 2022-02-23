import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, Length, Validate } from "class-validator";
import { IsBeforeConstraint } from "../../../helpers/decorator.date.helper";

export class CreateProjectDto {
    @Length(4, 40)
    @IsString()
    @ApiProperty({ minimum: 2, maximum: 100 })
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    description?: string;

    @IsNotEmpty()
    @IsDateString()
    @Validate(IsBeforeConstraint, ['end'])
    @ApiProperty()
    begin: Date;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false, default: true })
    active?: boolean;

    @IsNotEmpty()
    @IsDateString()
    @IsOptional()
    @ApiProperty({ required: false })
    end?: Date;

}

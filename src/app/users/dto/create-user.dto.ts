import { IsNotEmpty, Matches, Length, IsBoolean, IsOptional } from "class-validator";
import { RegExHelper } from "../../../helpers/regex.helper"
import { MessagesHelper } from "../../../helpers/messages.helper"
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @Length(4, 40)
    @ApiProperty({ minimum: 4, maximum: 40 })
    username: string;

    @IsNotEmpty()
    @Matches(RegExHelper.password, {
        message: MessagesHelper.PASSWORD_VALID
    })
    @ApiProperty({ description: "deve conter 8 caracterer e possuir: letra maiúscula, letra minúscula, caractere especial e número." })
    password: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false, default: true })
    active?: boolean;
}

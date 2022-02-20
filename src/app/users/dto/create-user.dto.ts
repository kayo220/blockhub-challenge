import { IsNotEmpty, Matches, Length, IsBoolean, IsOptional } from "class-validator";
import { RegExHelper } from "../../../helpers/regex.helper"
import { MessagesHelper } from "../../../helpers/messages.helper"

export class CreateUserDto {
    @Length(4, 40)
    username: string;

    @IsNotEmpty()
    @Matches(RegExHelper.password, {
        message: MessagesHelper.PASSWORD_VALID
    })
    password: string;

    @IsBoolean()
    @IsOptional()
    active?: boolean;
}

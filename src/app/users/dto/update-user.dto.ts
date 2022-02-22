import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { RegExHelper } from '../../../helpers/regex.helper';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsNotEmpty()
    @Matches(RegExHelper.password)
    @ApiProperty({ description: "deve conter 8 caracterer e possuir: letra maiúscula, letra minúscula, caractere especial e número." })
    password: string;
}

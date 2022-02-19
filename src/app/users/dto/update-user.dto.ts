import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, Matches } from 'class-validator';
import { RegExHelper } from 'src/helpers/regex.helper';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsNotEmpty()
    @Matches(RegExHelper.password)
    password: string;
}

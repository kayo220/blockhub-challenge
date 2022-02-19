import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { hashSync } from 'bcrypt'
import { MessagesHelper } from 'src/helpers/messages.helper';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  async hashPassword(password: string) {
    return await hashSync(password, 10)
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const searchUser = await this.usersService.searchUserByUsername(createUserDto.username);
    if (searchUser) {
      throw new HttpException({
        status: 400,
        error: MessagesHelper.USER_ALREADY_EXISTS_ERROR,
      }, 400)
    }
    createUserDto.password = await this.hashPassword(createUserDto.password)
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    loginUserDto.password = await this.hashPassword(loginUserDto.password)

    const validateUser = await this.usersService.verifyUser(loginUserDto.username, loginUserDto.password);
    if (validateUser) {
      if (validateUser.active && validateUser.active == "1") {
        return validateUser
      } else {
        throw new HttpException({
          status: 400,
          error: MessagesHelper.USER_NOT_ACTIVE,
        }, 400)
      }
    } else {
      throw new HttpException({
        status: 400,
        error: MessagesHelper.WRONG_CREDENTIALS,
      }, 400)
    }
  }

  @Delete("/delete/all")
  remvoeAll() {
    return this.usersService.removeAll();
  }

}

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { hashSync } from 'bcrypt'
import { MessagesHelper } from 'src/helpers/messages.helper';
import { AuthGuard } from '@nestjs/passport';
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
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    updateUserDto.password = await this.hashPassword(updateUserDto.password)
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete("/delete/all")
  async removeAll() {
    return await this.usersService.removeAll();
  }

}

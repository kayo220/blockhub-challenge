import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
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
  async login(@Body() createUserDto: LoginUserDto) {
    const validateUser = await this.usersService.searchUser(createUserDto);
    if (validateUser) {
      if (validateUser.active && validateUser.active == "1") {
        return validateUser
      } else {
        return { status: 400, message: "User is not active" }
        //throw new Error("User is not active")
      }
    } else {
      return { status: 400, message: "Invalid Credentials" }
      //throw new Error("Invalid Credentials")
    }
  }

}

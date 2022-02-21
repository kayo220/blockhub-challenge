import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { hashSync } from 'bcrypt'
import { MessagesHelper } from 'src/helpers/messages.helper';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import userView from './view/user.view';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  async hashPassword(password: string) {
    return await hashSync(password, 10)
  }

  @ApiOkResponse({ description: "User created" })
  @ApiBadRequestResponse({ description: "Wrong Input" })
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
    const newUser = await this.usersService.create(createUserDto);
    return userView.render(newUser);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Get()
  async findAll() {
    return userView.renderMany(await this.usersService.findAll());
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse()
  @ApiBadRequestResponse({ description: "User not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new HttpException({
        status: 400,
        error: MessagesHelper.USER_NOT_FOUND,
      }, 400)
    }
    return userView.render(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ description: "User updated" })
  @ApiBadRequestResponse({ description: "User not found or Invalid Password Pattern" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    updateUserDto.password = await this.hashPassword(updateUserDto.password)
    const updated = await this.usersService.update(id, updateUserDto);
    if (!updated) {
      throw new HttpException({
        status: 400,
        error: MessagesHelper.USER_NOT_FOUND,
      }, 400)
    }
    return userView.render(updated);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ description: "User deleted" })
  @ApiBadRequestResponse({ description: "User not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.usersService.remove(id);
    if (!deleted) {
      throw new HttpException({
        status: 400,
        error: MessagesHelper.USER_NOT_FOUND,
      }, 400)
    }
    return deleted
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ description: "All users were deleted" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @UseGuards(AuthGuard('jwt'))
  @Delete("/delete/all")
  async removeAll() {
    return await this.usersService.removeAll();
  }

}

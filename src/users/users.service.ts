import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }


  create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate({
      _id: id
    }, {
      $set: updateUserDto
    }, {
      new: true,
    });
  }

  remove(id: string) {
    return this.userModel.deleteOne({
      _id: id,
    }).exec();
  }

  async searchUser(loginUserDto: LoginUserDto): Promise<User> {
    return this.userModel.findOne({
      username: loginUserDto.username,
      password: loginUserDto.password
    })
  }
}

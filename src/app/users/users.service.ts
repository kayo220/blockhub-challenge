import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }


  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    return await user.save();
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(id: string) {
    try {
      return await this.userModel.findById(id);
    } catch (Error) {

    }
    return null;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.userModel.findByIdAndUpdate({
        _id: id
      }, {
        $set: updateUserDto
      }, {
        new: true,
      });
    } catch (Error) {
      return null
    }
  }

  async remove(id: string) {
    try {
      return await this.userModel.deleteOne({
        _id: id,
      }).exec();
    } catch (Error) {

    }
    return null
  }
  async removeAll() {
    return await this.userModel.deleteMany({

    })
  }

  async verifyUser(username: string, password: string): Promise<User> {
    return await this.userModel.findOne({
      username: username,
      password: password
    })
  }

  async searchUserByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({
      username: username
    })
  }
}

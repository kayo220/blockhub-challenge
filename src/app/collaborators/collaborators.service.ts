import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { Collaborator, CollaboratorDocument } from './entities/collaborator.entity';

@Injectable()
export class CollaboratorsService {
  constructor(@InjectModel(Collaborator.name) private collaboratorModel: Model<CollaboratorDocument>) { }

  async create(createCollaboratorDto: CreateCollaboratorDto) {
    const collaborator = new this.collaboratorModel(createCollaboratorDto);
    return await collaborator.save();
  }

  async findAll() {
    return await this.collaboratorModel.find();
  }

  async findOne(id: string) {
    try {
      return await this.collaboratorModel.findOne({ _id: id });
    } catch (Error) {
      //treating objectid cast error
    }
    return null;
  }

  async update(id: string, updateCollaboratorDto: UpdateCollaboratorDto) {
    return await this.collaboratorModel.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: updateCollaboratorDto
      },
      {
        new: true
      }
    );
  }

  async remove(id: string) {
    try{
      return await this.collaboratorModel.deleteOne({ _id: id }).exec();
    }catch(Error){

    }
    return null
  }

  async removeAll() {
    return await this.collaboratorModel.deleteMany();
  }
}

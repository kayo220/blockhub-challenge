import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './entities/project.entity';

@Injectable()
export class ProjectsService {

  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) { }

  async create(createProjectDto: CreateProjectDto) {
    const project = new this.projectModel(createProjectDto);
    return await project.save();
  }

  async findAll() {
    return await this.projectModel.find();
  }

  async findOne(id: string): Promise<any> {
    try {
      return await this.projectModel.findById(id)
    } catch (Error) {
      //if catches an error it will return null (Treating ObjectID CAST ERROR)
    }
    return null;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    return await this.projectModel.findByIdAndUpdate(
      {
        _id: id
      },
      {
        $set: updateProjectDto
      },
      {
        new: true,
      });
  }

  async remove(id: string) {
    try {
      return await this.projectModel.deleteOne({ _id: id }).exec();
    } catch (Error) {

    }
    return null
  }

  async removeAll() {
    return await this.projectModel.deleteMany({});
  }

  async searchProjectByName(name: string) {
    try {
      return await this.projectModel.findOne({
        name: name
      })
    } catch (Error) {

    }
    return null
  }
}

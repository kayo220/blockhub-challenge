import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCollaboratorsProjectDto } from './dto/create-collaborators-project.dto';
import { UpdateCollaboratorsProjectDto } from './dto/update-collaborators-project.dto';
import { Model } from 'mongoose';
import { CollaboratorsProjects, CollaboratorsProjectsDocument } from './entities/collaborators-project.entity';
import { Project } from '../projects/entities/project.entity';
import { Collaborator } from '../collaborators/entities/collaborator.entity';

@Injectable()
export class CollaboratorsProjectsService {
  constructor(@InjectModel(CollaboratorsProjects.name) private collaboratorsProjectsModel: Model<CollaboratorsProjectsDocument>) { }

  async create(createCollaboratorsProjectDto: CreateCollaboratorsProjectDto, project: Project, collaborator: Collaborator) {
    const collaboratorProject = new this.collaboratorsProjectsModel({ ...createCollaboratorsProjectDto, project: project, collaborator: collaborator })
    return await collaboratorProject.save();
  }

  async findAll() {
    return await this.collaboratorsProjectsModel.find().populate('project').populate('collaborator').exec();
  }

  async findOne(id: string) {
    try {
      return await this.collaboratorsProjectsModel.findById(id).populate('project').populate('collaborator').exec();
    } catch (Error) {

    }
    return null
  }

  async update(id: string, updateCollaboratorsProjectDto: UpdateCollaboratorsProjectDto) {
    return await this.collaboratorsProjectsModel.findByIdAndUpdate({
      _id: id
    },
      {
        $set: updateCollaboratorsProjectDto
      },
      {
        new: true
      });
  }

  async remove(id: string) {
    try{
      return await this.collaboratorsProjectsModel.deleteOne({ _id: id });
    }catch(Error){
      return null;
    }
  }

  async removeAll() {
    return await this.collaboratorsProjectsModel.deleteMany();
  }

  async findManyByCollaborator(collaborator_id: string) {
    try {
      return await this.collaboratorsProjectsModel.find({ collaborator: collaborator_id }).populate('project').populate('collaborator').exec();
    } catch (Error) {

    }
    return null
  }

  async findManyByProject(project_id: string) {
    try {
      return await this.collaboratorsProjectsModel.find({ project: project_id }).populate('project').populate('collaborator').exec();
    } catch (Error) {

    }
    return null
  }
}

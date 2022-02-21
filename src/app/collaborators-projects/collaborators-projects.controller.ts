import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException } from '@nestjs/common';
import { truncate } from 'fs';
import { MessagesHelper } from 'src/helpers/messages.helper';
import { CollaboratorsService } from '../collaborators/collaborators.service';
import { Project } from '../projects/entities/project.entity';
import { ProjectsService } from '../projects/projects.service';
import { CollaboratorsProjectsService } from './collaborators-projects.service';
import { CreateCollaboratorsProjectDto } from './dto/create-collaborators-project.dto';
import { UpdateCollaboratorsProjectDto } from './dto/update-collaborators-project.dto';

@Controller('collaborators-projects')
export class CollaboratorsProjectsController {
  constructor(private readonly collaboratorsProjectsService: CollaboratorsProjectsService,
    private readonly collaboratorsService: CollaboratorsService,
    private readonly projectsService: ProjectsService) { }

  @Post()
  async create(@Body() createCollaboratorsProjectDto: CreateCollaboratorsProjectDto) {
    const project = await this.projectsService.findOne(createCollaboratorsProjectDto.project_id);
    if (!project) {
      throw new HttpException({
        status: 400,
        error: MessagesHelper.PROJECT_NOT_FOUND,
      }, 400)
    }
    const collaborator = await this.collaboratorsService.findOne(createCollaboratorsProjectDto.collaborator_id);
    if (!collaborator) {
      throw new HttpException({
        status: 400,
        error: MessagesHelper.COLLABORATOR_NOT_FOUND,
      }, 400)
    }

    if (!(await this.checkDateIsAvaliable(collaborator._id, new Date(createCollaboratorsProjectDto.begin), new Date(createCollaboratorsProjectDto.end)))) {
      throw new HttpException({
        status: 400,
        error: MessagesHelper.COLLABORATOR_IS_ALREADY_IN_A_PROJECT,
      }, 400)
    }


    return await this.collaboratorsProjectsService.create(createCollaboratorsProjectDto, project, collaborator);
  }

  @Get()
  async findAll() {
    return await this.collaboratorsProjectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.collaboratorsProjectsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCollaboratorsProjectDto: UpdateCollaboratorsProjectDto) {
    const collaborator_project = await this.collaboratorsProjectsService.findOne(id);
    if (!collaborator_project) {
      throw new HttpException({
        status: 400,
        error: MessagesHelper.COLLABORATOR_PROJECT_NOT_FOUND,
      }, 400)
    }
    if (!(await this.checkDateIsAvaliable(collaborator_project.collaborator["_id"].toString(), new Date(updateCollaboratorsProjectDto.begin),
      new Date(updateCollaboratorsProjectDto.end), id))) {
      throw new HttpException({
        status: 400,
        error: MessagesHelper.COLLABORATOR_IS_ALREADY_IN_A_PROJECT,
      }, 400)
    }

    return await this.collaboratorsProjectsService.update(id, updateCollaboratorsProjectDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.collaboratorsProjectsService.remove(id);
  }

  //@UseGuards(AuthGuard('jwt'))
  @Delete("/delete/all")
  async removeAll() {
    return await this.collaboratorsProjectsService.removeAll();
  }

  @Get('/collaborator/:id')
  async findManyByCollaborator(@Param('id') id: string) {
    const projectsByCollaborator = await this.collaboratorsProjectsService.findManyByCollaborator(id);

    return projectsByCollaborator
  }

  @Get('/project/:id')
  async findManyByProject(@Param('id') id: string) {
    const projectsByCollaborator = await this.collaboratorsProjectsService.findManyByProject(id);

    return projectsByCollaborator
  }

  async checkDateIsAvaliable(idCollaborator: string, dateBegin: Date, dateEnd: Date, idProjectCollaborator?: string) {
    const projectsByCollaborator = await this.collaboratorsProjectsService.findManyByCollaborator(idCollaborator);
    console.log(projectsByCollaborator)
    let projectsByCollaboratorFilter = projectsByCollaborator.filter(element => {
      if ((dateBegin <= element.begin && element.begin <= dateEnd) || (dateBegin <= element.end && element.end <= dateEnd)) {
        if (!idProjectCollaborator) {//only filters if is a different project
          return true
        } else if (idProjectCollaborator && element._id.toString() != idProjectCollaborator) {
          return true
        }
      }
      return false;
    })//if no element is filtered the data given is avaliable to register a user in a project
    return projectsByCollaboratorFilter.length == 0
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { truncate } from 'fs';
import { MessagesHelper } from '../../helpers/messages.helper';
import { CollaboratorsService } from '../collaborators/collaborators.service';
import { Project } from '../projects/entities/project.entity';
import { ProjectsService } from '../projects/projects.service';
import { CollaboratorsProjectsService } from './collaborators-projects.service';
import { CreateCollaboratorsProjectDto } from './dto/create-collaborators-project.dto';
import { UpdateCollaboratorsProjectDto } from './dto/update-collaborators-project.dto';

@Controller('collaborators-projects')
@ApiTags('collaborators-projects')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class CollaboratorsProjectsController {
  constructor(private readonly collaboratorsProjectsService: CollaboratorsProjectsService,
    private readonly collaboratorsService: CollaboratorsService,
    private readonly projectsService: ProjectsService) { }

  @ApiOkResponse({ description: "Collaborator and Project relation created!" })
  @ApiBadRequestResponse({ description: "Collaborator or Project not found!" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
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

  @ApiOkResponse()
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Get()
  async findAll() {
    return await this.collaboratorsProjectsService.findAll();
  }

  @ApiOkResponse()
  @ApiBadRequestResponse({ description: "Project-Collaborattor was not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const collaboratorProject = await this.collaboratorsProjectsService.findOne(id);
    if (!collaboratorProject) {
      throw new HttpException({
        status: 400,
        error: MessagesHelper.COLLABORATOR_PROJECT_NOT_FOUND,
      }, 400)
    }
    return collaboratorProject
  }

  @ApiOkResponse({ description: "Collaborator and Project relation updated!" })
  @ApiBadRequestResponse({ description: "Project-Collaborattor was not found or Not able to update because collaborator is already in another project in the given date" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
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

  @ApiOkResponse({ description: "Collaborator and Project relation removed!" })
  @ApiBadRequestResponse({ description: "Project-Collaborattor was not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.collaboratorsProjectsService.remove(id)
    if (!deleted) {
      throw new HttpException({
        status: 400,
        error: MessagesHelper.COLLABORATOR_PROJECT_NOT_FOUND,
      }, 400)
    }
    return deleted;
  }

  @ApiOkResponse({ description: "Collaborator and Project relation removed!" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Delete("/delete/all")
  async removeAll() {
    return await this.collaboratorsProjectsService.removeAll();
  }

  @ApiOkResponse({ description: "Projects by colaborator was found" })
  @ApiBadRequestResponse({ description: "Project by Collaborattor was not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Get('/collaborator/:id')
  async findManyByCollaborator(@Param('id') id: string) {
    const projectsByCollaborator = await this.collaboratorsProjectsService.findManyByCollaborator(id);
    if (!projectsByCollaborator) {

    }
    return projectsByCollaborator
  }

  @ApiOkResponse({ description: "Collaborator and Project relation removed!" })
  @ApiBadRequestResponse({ description: "Collaborators by project was not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Get('/project/:id')
  async findManyByProject(@Param('id') id: string) {
    const projectsByCollaborator = await this.collaboratorsProjectsService.findManyByProject(id);
    return projectsByCollaborator
  }

  //method to verify if an collaborator is not working in a given date
  async checkDateIsAvaliable(idCollaborator: string, dateBegin: Date, dateEnd: Date, idProjectCollaborator?: string) {
    const projectsByCollaborator = await this.collaboratorsProjectsService.findManyByCollaborator(idCollaborator);
    let projectsByCollaboratorFilter = projectsByCollaborator.filter(element => {
      if ((dateBegin >= element.begin && dateBegin <= element.end) || (dateEnd >= element.begin && dateEnd <= element.end) ||
        (dateBegin <= element.end && dateEnd >= element.end)) {
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

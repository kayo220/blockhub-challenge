import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException } from '@nestjs/common';
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
    console.log(project)
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
}

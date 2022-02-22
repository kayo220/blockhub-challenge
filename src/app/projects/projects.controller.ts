import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { MessagesHelper } from '../../helpers/messages.helper';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('projects')
@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @ApiOkResponse({ description: "Project was created" })
  @ApiBadRequestResponse({ description: "Wrong Input or Project Already Exists" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    const searchProject = await this.projectsService.searchProjectByName(createProjectDto.name);
    if (searchProject) {
      throw new HttpException({
        status: 400,
        error: MessagesHelper.PROJECT_ALREADY_EXISTS_ERROR,
      }, 400)
    }

    return await this.projectsService.create(createProjectDto);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Get()
  async findAll() {
    return await this.projectsService.findAll();
  }

  @ApiOkResponse({ description: "Project found" })
  @ApiBadRequestResponse({ description: "Project not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const project = await this.projectsService.findOne(id);
    if (!project) {
      throw new HttpException({
        status: 400,
        error: MessagesHelper.PROJECT_NOT_FOUND,
      }, 400)
    }
    return project
  }

  @ApiOkResponse({ description: "Project updated" })
  @ApiBadRequestResponse({ description: "Wrong Input or Project not found or Already Exists a Project with the Given Name" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    if (updateProjectDto.name) {//if updateProjectDto has name
      const searchProject = await this.projectsService.searchProjectByName(updateProjectDto.name);
      if (searchProject && searchProject._id != id) {//if the given name is already used in another project
        throw new HttpException({
          status: 400,
          error: MessagesHelper.PROJECT_ALREADY_EXISTS_ERROR,
        }, 400)
      }
    }
    const newProject = await this.projectsService.update(id, updateProjectDto);
    if(!newProject){
      throw new HttpException({
        status: 400,
        error: MessagesHelper.PROJECT_NOT_FOUND,
      }, 400)
    }
    return newProject
  }

  @ApiOkResponse({ description: "Project deleted" })
  @ApiBadRequestResponse({ description: "Project not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.projectsService.remove(id);
    if (!deleted) {
      throw new HttpException({
        status: 400,
        error: MessagesHelper.PROJECT_NOT_FOUND,
      }, 400)
    }
    return deleted;
  }

  @ApiOkResponse({ description: "All project was deleted" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Delete("/delete/all")
  async removeAll() {
    return await this.projectsService.removeAll();
  }
}

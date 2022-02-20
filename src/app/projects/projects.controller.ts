import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { MessagesHelper } from 'src/helpers/messages.helper';
import { AuthGuard } from '@nestjs/passport';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

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

  @Get()
  async findAll() {
    return await this.projectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.projectsService.findOne(id);
  }

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
    return await this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.projectsService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete("/delete/all")
  async removeAll() {
    return await this.projectsService.removeAll();
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CollaboratorsService } from './collaborators.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';

@Controller('collaborators')
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) { }

  @Post()
  async create(@Body() createCollaboratorDto: CreateCollaboratorDto) {
    return await this.collaboratorsService.create(createCollaboratorDto);
  }

  @Get()
  async findAll() {
    return await this.collaboratorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.collaboratorsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCollaboratorDto: UpdateCollaboratorDto) {
    return await this.collaboratorsService.update(id, updateCollaboratorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.collaboratorsService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete("/delete/all")
  async removeAll() {
    return await this.collaboratorsService.removeAll();
  }


}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MessagesHelper } from '../../helpers/messages.helper';
import { CollaboratorsService } from './collaborators.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';

@ApiTags('collaborators')
@Controller('collaborators')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) { }

  @Post()
  @ApiCreatedResponse({ description: "Collaborator created!" })
  @ApiBadRequestResponse({ description: "Invalid Inputs or Collaborator not found!" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async create(@Body() createCollaboratorDto: CreateCollaboratorDto) {
    return await this.collaboratorsService.create(createCollaboratorDto);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Get()
  async findAll() {
    return await this.collaboratorsService.findAll();
  }
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const collaborator = await this.collaboratorsService.findOne(id);
    if (!collaborator) {
      throw new HttpException({
        status: 400,
        error: MessagesHelper.COLLABORATOR_NOT_FOUND,
      }, 400)
    }
    return collaborator;
  }

  @ApiOkResponse({ description: "Collaborator updated!" })
  @ApiBadRequestResponse({ description: "Invalid Inputs or Collaborator not found!" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCollaboratorDto: UpdateCollaboratorDto) {
    const updateCollaborator = await this.collaboratorsService.update(id, updateCollaboratorDto);;
    if (!updateCollaborator) {
      throw new HttpException({
        status: 400,
        error: MessagesHelper.COLLABORATOR_NOT_FOUND,
      }, 400)
    }

    return updateCollaborator;
  }

  @ApiOkResponse({ description: "Collaborator deleted!" })
  @ApiBadRequestResponse({ description: "Collaborator not found!" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleteCollaborator = await this.collaboratorsService.remove(id);
    if (!deleteCollaborator) {
      throw new HttpException({
        status: 400,
        error: MessagesHelper.COLLABORATOR_NOT_FOUND,
      }, 400)
    }
    return deleteCollaborator
  }

  @Delete("/delete/all")
  async removeAll() {
    return await this.collaboratorsService.removeAll();
  }


}

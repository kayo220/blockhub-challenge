import { PartialType } from '@nestjs/mapped-types';
import { CreateCollaboratorsProjectDto } from './create-collaborators-project.dto';

export class UpdateCollaboratorsProjectDto extends PartialType(CreateCollaboratorsProjectDto) {}

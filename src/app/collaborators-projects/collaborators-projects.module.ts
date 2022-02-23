import { Module } from '@nestjs/common';
import { CollaboratorsProjectsService } from './collaborators-projects.service';
import { CollaboratorsProjectsController } from './collaborators-projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CollaboratorsProjects, CollaboratorsProjectsSchema } from './entities/collaborators-project.entity';
import { ProjectsModule } from '../projects/projects.module';
import { CollaboratorsModule } from '../collaborators/collaborators.module';
import { CollaboratorsService } from '../collaborators/collaborators.service';
import { ProjectsService } from '../projects/projects.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: CollaboratorsProjects.name, schema: CollaboratorsProjectsSchema }]),
    ProjectsModule, CollaboratorsModule],
  controllers: [CollaboratorsProjectsController],
  providers: [CollaboratorsProjectsService, CollaboratorsService, ProjectsService]
})
export class CollaboratorsProjectsModule { }

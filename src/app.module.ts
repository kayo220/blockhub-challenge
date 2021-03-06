import { Module } from '@nestjs/common';
import { UsersModule } from './app/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './app/projects/projects.module';
import { CollaboratorsModule } from './app/collaborators/collaborators.module';
import { CollaboratorsProjectsModule } from './app/collaborators-projects/collaborators-projects.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    UsersModule,
    AuthModule,
    ProjectsModule,
    CollaboratorsModule,
    CollaboratorsProjectsModule]

})
export class AppModule { }

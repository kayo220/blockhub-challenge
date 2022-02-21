import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Desafio Blackend Jr.')
    .setDescription('Blockhub Builders - Project/Collaborator Management')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('projects')
    .addTag('collaborators')
    .addTag('collaborators-projects')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();

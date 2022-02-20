import { Test, TestingModule } from '@nestjs/testing';
import { CollaboratorsProjectsController } from './collaborators-projects.controller';
import { CollaboratorsProjectsService } from './collaborators-projects.service';

describe('CollaboratorsProjectsController', () => {
  let controller: CollaboratorsProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollaboratorsProjectsController],
      providers: [CollaboratorsProjectsService],
    }).compile();

    controller = module.get<CollaboratorsProjectsController>(CollaboratorsProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

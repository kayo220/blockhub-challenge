import { Test, TestingModule } from '@nestjs/testing';
import { CollaboratorsProjectsService } from './collaborators-projects.service';

describe('CollaboratorsProjectsService', () => {
  let service: CollaboratorsProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollaboratorsProjectsService],
    }).compile();

    service = module.get<CollaboratorsProjectsService>(CollaboratorsProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

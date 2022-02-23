import { Test, TestingModule } from '@nestjs/testing';
import { CollaboratorsController } from './collaborators.controller';
import { CollaboratorsService } from './collaborators.service';

describe('CollaboratorsController', () => {
  let controller: CollaboratorsController;
  let mockCollaboratorService = {
    id: 1,
    collaborator: [{
      _id: "0",
      name: "Kayo Santana",
      role: "Backend Developer",
      admission: "2012-02-02",
      active: true
    }, {
      _id: "1",
      name: "Brenda",
      role: "HR",
      admission: "2012-02-02",
      active: true
    }],
    create: jest.fn(dto => {
      const newCollaborator = {
        _id: ++mockCollaboratorService.id,
        name: dto.name,
        role: dto.role,
        admission: dto.admission,
        active: !dto.active ? true : dto.active
      }
      mockCollaboratorService.collaborator.push(newCollaborator);
      return newCollaborator
    }),
    findAll: jest.fn(() => {
      return mockCollaboratorService.collaborator
    }),
    findOne: jest.fn(id => {
      const collaborator = mockCollaboratorService.collaborator.find(element => element._id == id)
      return collaborator
    }),
    update: jest.fn((id, dto) => {
      const index = mockCollaboratorService.collaborator.findIndex(element => element._id == id);
      if (index == -1) {
        return null
      }
      mockCollaboratorService.collaborator[index].name = !dto.name ? mockCollaboratorService.collaborator[index].name : dto.password
      mockCollaboratorService.collaborator[index].active = dto.active == undefined ? mockCollaboratorService.collaborator[index].active : dto.active
      mockCollaboratorService.collaborator[index].admission = !dto.admission ? mockCollaboratorService.collaborator[index].admission : dto.admission
      mockCollaboratorService.collaborator[index].role = !dto.role ? mockCollaboratorService.collaborator[index].role : dto.role
      return mockCollaboratorService.collaborator[index];
    }),
    remove: jest.fn(id => {
      const findCollaborator = mockCollaboratorService.findOne(id)
      if (!findCollaborator) {
        return null
      }
      mockCollaboratorService.collaborator = mockCollaboratorService.collaborator.filter(element => element._id != id)//remove the element from the array
      return { deletedCount: 1 };//simulate mongoose return for remove
    })
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollaboratorsController],
      providers: [CollaboratorsService],
    }).overrideProvider(CollaboratorsService).useValue(mockCollaboratorService).compile();

    controller = module.get<CollaboratorsController>(CollaboratorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a collaborator', async () => {
    const dto = { name: "new challenge", admission: new Date("2002-02-03"), role: "role" }
    const response = await controller.create(dto)
    expect(response).toEqual({
      _id: mockCollaboratorService.collaborator.length - 1,//simulate the created id
      name: dto.name,
      admission: dto.admission,
      role: dto.role,
      active: true
    });
    expect(mockCollaboratorService.collaborator[mockCollaboratorService.collaborator.length - 1]._id).toBe(response._id)//verify if id is right and object is inserted
    expect(mockCollaboratorService.create).toHaveBeenCalledWith(dto)
  });

  it('should return all collaborator', async () => {
    const allUsers = await controller.findAll();
    expect(allUsers.length).toBe(mockCollaboratorService.collaborator.length)
    expect(mockCollaboratorService.findAll)
  });

  it('should return a specif collaborator by id', async () => {
    const collaborator = await controller.findOne("0");
    expect(mockCollaboratorService.collaborator[0]._id).toBe(collaborator._id)
    expect(mockCollaboratorService.findOne)

  });
  it('should not return a specif collaborator by id - collaborator not exists', async () => {
    await expect(controller.findOne("zzzz")).rejects.toThrow() //ID NOT FOUND...
    expect(mockCollaboratorService.findOne)
  });

  it('should update a specif collaborator by id', async () => {
    const dto = { name: "BlockHub Challenge2", admission: new Date("2002-02-03"), role: "Job", active: false }
    const collaborator = await controller.update("0", dto);
    expect(mockCollaboratorService.collaborator[0]._id).toBe(collaborator._id)
    expect(mockCollaboratorService.collaborator[0].active).toBe(false)
    expect(mockCollaboratorService.collaborator[0].name).toBe(collaborator.name)
    expect(mockCollaboratorService.collaborator[0].admission).toBe(collaborator.admission)
    expect(mockCollaboratorService.collaborator[0].role).toBe(collaborator.role)

    expect(mockCollaboratorService.update)
  });

  it('should not update a specif collaborator by id - collaborator not exists', async () => {
    const dto = { name: "blockgub challenge", description: "its description", begin: new Date("2002-02-03"), end: new Date("2002-03-03"), active: false }
    await expect(controller.update("zzzz", dto)).rejects.toThrow() //ID NOT FOUND...
    expect(mockCollaboratorService.update)
  });

  it('should not update a specif collaborator by id - new given name already exists', async () => {
    const dto = { name: "URI challenge", description: "its description", begin: new Date("2002-02-03"), end: new Date("2002-03-03"), active: false }
    await expect(controller.update("zzzz", dto)).rejects.toThrow() //ID NOT FOUND...
    expect(mockCollaboratorService.update)
  });


  it('should delete a specif collaborator by id', async () => {
    const id = "1";
    const response = await controller.remove(id);
    expect(response.deletedCount).toBe(1)
    const searchDeletedUser = mockCollaboratorService.collaborator.find(element => element._id == id)
    expect(searchDeletedUser).toBe(undefined)
    expect(mockCollaboratorService.remove)
  });

  it('should not delete a specif collaborator by id - collaborator not exists', async () => {
    await expect(controller.remove("zzzz")).rejects.toThrow() //ID NOT FOUND...
    expect(mockCollaboratorService.remove)
  });
});

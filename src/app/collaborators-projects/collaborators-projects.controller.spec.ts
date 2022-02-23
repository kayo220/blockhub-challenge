import { Test, TestingModule } from '@nestjs/testing';
import { CollaboratorsService } from '../collaborators/collaborators.service';
import { ProjectsService } from '../projects/projects.service';
import { CollaboratorsProjectsController } from './collaborators-projects.controller';
import { CollaboratorsProjectsService } from './collaborators-projects.service';

describe('CollaboratorsProjectsController', () => {
  let controller: CollaboratorsProjectsController;



  let mockProjectService = {
    id: 1,
    projects: [{
      _id: "0",
      name: "blockhub challenge",
      description: "teste",
      begin: "2012-02-02",
      end: "2012-02-10",
      active: true
    }, {
      _id: "1",
      name: "URI challenge",
      begin: "2012-02-02",
      description: "teste",
      end: "2012-02-10",
      active: true
    }],
    create: jest.fn(dto => {
      const newProject = {
        _id: ++mockProjectService.id,
        name: dto.name,
        description: dto.description,
        begin: dto.begin,
        end: dto.end,
        active: !dto.active ? true : dto.active
      }
      mockProjectService.projects.push(newProject);
      return newProject
    }),
    searchProjectByName: jest.fn(name => {
      const filterUsers = mockProjectService.projects.filter(project => project.name == name)
      return filterUsers.length == 0 ? null : filterUsers[0]
    }),
    findAll: jest.fn(() => {
      return mockProjectService.projects
    }),
    findOne: jest.fn(id => {
      const project = mockProjectService.projects.find(element => element._id == id)
      return project
    }),
    update: jest.fn((id, dto) => {
      const index = mockProjectService.projects.findIndex(element => element._id == id);
      if (index == -1) {
        return null
      }
      mockProjectService.projects[index].name = !dto.name ? mockProjectService.projects[index].name : dto.password
      mockProjectService.projects[index].active = dto.active == undefined ? mockProjectService.projects[index].active : dto.active
      mockProjectService.projects[index].begin = !dto.begin ? mockProjectService.projects[index].begin : dto.begin
      mockProjectService.projects[index].end = !dto.end ? mockProjectService.projects[index].end : dto.end
      return mockProjectService.projects[index];
    }),
    remove: jest.fn(id => {
      const findUser = mockProjectService.findOne(id)
      if (!findUser) {
        return null
      }
      mockProjectService.projects = mockProjectService.projects.filter(element => element.id != id)//remove the element from the array
      return { deletedCount: 1 };//simulate mongoose return for remove
    })
  }

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

  let mockCollaboratorsProjects = {
    id: 1,
    collaborator_project: [{
      _id: "0",
      project_id: "1",
      collaborator_id: "1",
      begin: new Date("2022-02-02"),
      end: new Date("2022-02-23")
    }, {
      _id: "1",
      project_id: "1",
      collaborator_id: "1",
      begin: new Date("2022-01-01"),
      end: new Date("2022-01-23")
    }],
    populate: jest.fn(async (collaborator_project_id) => {
      let element = mockCollaboratorsProjects.collaborator_project.find(element => element._id == collaborator_project_id);
      element.project = await mockProjectService.findOne(element.project_id)
      element.collaborator = await mockCollaboratorService.findOne(element.collaborator_id)
      return element
    }),
    findManyByCollaborator: jest.fn(async (collaborator_id) => {
      let collaborators_project = await mockCollaboratorsProjects.collaborator_project.filter(element => element.collaborator_id == collaborator_id);
      let collaborators_project_populated = [];
      await Promise.all(collaborators_project.map(async (element) => {
        let newElement = await mockCollaboratorsProjects.populate(element._id);
        collaborators_project_populated.push(newElement)
      }))
      return collaborators_project_populated;
    }),
    findManyByProject: jest.fn(async (project_id) => {
      let collaborators_project = await mockCollaboratorsProjects.collaborator_project.filter(element => element.project_id == project_id);
      let collaborators_project_populated = [];
      await Promise.all(collaborators_project.map(async (element) => {
        let newElement = await mockCollaboratorsProjects.populate(element._id);
        collaborators_project_populated.push(newElement)
      }))
      return collaborators_project_populated;
    }),
    create: jest.fn((dto) => {
      const newCollaborator = {
        _id: ++mockCollaboratorsProjects.id,
        project_id: dto.project_id,
        begin: dto.begin,
        end: dto.end,
        collaborator_id: dto.collaborator_id
      }
      mockCollaboratorsProjects.collaborator_project.push(newCollaborator);
      return mockCollaboratorsProjects.populate(newCollaborator._id)
    }),
    findAll: jest.fn(async () => {
      let collaborators_project_populated = []
      await Promise.all(mockCollaboratorsProjects.collaborator_project.map(async (element) => {
        collaborators_project_populated.push(await mockCollaboratorsProjects.populate(element.collaborator_id))
      }))
      return collaborators_project_populated
    }),
    findOne: jest.fn(id => {
      const collaborator_project = mockCollaboratorsProjects.collaborator_project.find(element => element._id == id)
      return mockCollaboratorsProjects.populate(collaborator_project._id)
    }),
    update: jest.fn((id, dto) => {
      const index = mockCollaboratorsProjects.collaborator_project.findIndex(element => element._id == id);
      if (index == -1) {
        return null
      }
      mockCollaboratorsProjects.collaborator_project[index].begin = !dto.begin ? mockCollaboratorsProjects.collaborator_project[index].begin : dto.begin
      mockCollaboratorsProjects.collaborator_project[index].end = !dto.end ? mockCollaboratorsProjects.collaborator_project[index].end : dto.end
      return mockCollaboratorsProjects.populate(mockCollaboratorsProjects.collaborator_project[index]._id);
    }),
    remove: jest.fn(id => {
      const findCollaboratorProject = mockCollaboratorsProjects.findOne(id)
      if (!findCollaboratorProject) {
        return null
      }
      mockCollaboratorsProjects.collaborator_project = mockCollaboratorsProjects.collaborator_project.filter(element => element._id != id)//remove the element from the array
      return { deletedCount: 1 };//simulate mongoose return for remove
    })
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollaboratorsProjectsController],
      providers: [CollaboratorsProjectsService, ProjectsService, CollaboratorsService],
    }).overrideProvider(CollaboratorsProjectsService).useValue(mockCollaboratorsProjects)
      .overrideProvider(ProjectsService).useValue(mockProjectService)
      .overrideProvider(CollaboratorsService).useValue(mockCollaboratorService)
      .compile();

    controller = module.get<CollaboratorsProjectsController>(CollaboratorsProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a collaborators-project - date interval is before a registered one', async () => {
    const dto = { project_id: "0", collaborator_id: "0", begin: new Date("2001-02-03"), end: new Date("2001-03-03") }
    const response = await controller.create(dto)
    expect(response).toEqual({
      _id: mockCollaboratorsProjects.collaborator_project.length - 1,//simulate the created id
      project_id: dto.project_id,
      collaborator_id: dto.collaborator_id,
      begin: dto.begin,
      end: dto.end,
      project: mockProjectService.projects[0],
      collaborator: mockCollaboratorService.collaborator[0]
    });
    expect(mockCollaboratorsProjects.collaborator_project[mockCollaboratorsProjects.id]._id).toBe(response._id)//verify if id is right and object is inserted
  });

  it('should create a collaborators-project - date interval is after a registered one', async () => {
    const dto = { project_id: "0", collaborator_id: "0", begin: new Date("2023-02-04"), end: new Date("2023-03-03") }
    const response = await controller.create(dto)
    expect(response).toEqual({
      _id: mockCollaboratorsProjects.collaborator_project.length - 1,//simulate the created id
      project_id: dto.project_id,
      collaborator_id: dto.collaborator_id,
      begin: dto.begin,
      end: dto.end,
      project: mockProjectService.projects[0],
      collaborator: mockCollaboratorService.collaborator[0]
    });
    expect(mockCollaboratorsProjects.collaborator_project[mockCollaboratorsProjects.id]._id).toBe(response._id)//verify if id is right and object is inserted
  });
  it('should not create a collaborators-project - new relation begin is inside another registered one', async () => {
    const dto = { project_id: "1", collaborator_id: "1", begin: new Date("2022-02-22"), end: new Date("2022-03-30") }
    await expect(controller.create(dto)).rejects.toThrow() //date intersection
  });

  it('should not create a collaborators-project - new relation end  is inside another registered one', async () => {
    const dto = { project_id: "1", collaborator_id: "1", begin: new Date("2022-02-01"), end: new Date("2022-02-20") }
    await expect(controller.create(dto)).rejects.toThrow() //date intersection
  });
  it('should not create a collaborators-project - collaborator is in another project inside the whole given period', async () => {
    const dto = { project_id: "1", collaborator_id: "1", begin: new Date("2022-02-01"), end: new Date("2022-02-03") }
    await expect(controller.create(dto)).rejects.toThrow() //date intersection
  });

  it('should create a collaborators-project - collaborator is different', async () => {
    const dto = { project_id: "1", collaborator_id: "0", begin: new Date("2022-02-01"), end: new Date("2022-02-03") }
    const response = await controller.create(dto)
    expect(response).toEqual({
      _id: mockCollaboratorsProjects.collaborator_project.length - 1,//simulate the created id
      project_id: dto.project_id,
      collaborator_id: dto.collaborator_id,
      begin: dto.begin,
      end: dto.end,
      project: mockProjectService.projects[1],
      collaborator: mockCollaboratorService.collaborator[0]
    });
    expect(mockCollaboratorsProjects.collaborator_project[mockCollaboratorsProjects.id]._id).toBe(response._id)//verify if id is right and object is inserted
  });

  it('should not create a collaborators-project - collaborator not found', async () => {
    const dto = { project_id: "0", collaborator_id: "z", begin: new Date("2050-02-01"), end: new Date("2050-02-03") }
    await expect(controller.create(dto)).rejects.toThrow() //date intersection
  });
  it('should not create a collaborators-project - project not found', async () => {
    const dto = { project_id: "z", collaborator_id: "0", begin: new Date("2050-02-01"), end: new Date("2050-02-03") }
    await expect(controller.create(dto)).rejects.toThrow() //date intersection
  });

  it('should return all projects', async () => {
    const allRelations = await controller.findAll();
    expect(allRelations.length).toBe(mockCollaboratorsProjects.collaborator_project.length)
  });

  it('should return a specif collaborator-project by id', async () => {
    const project = await controller.findOne("0");
    expect(mockProjectService.projects[0]._id).toBe(project._id)
    expect(mockProjectService.findOne)

  });

  it('should not return a specif collaborator-project by id - relation not exists', async () => {
    await expect(controller.findOne("zzzz")).rejects.toThrow() //ID NOT FOUND...
    expect(mockProjectService.findOne)
  });

  it('should update a specif collaborator-project by id', async () => {
    const dto = { begin: new Date("2030-02-22"), end: new Date("2030-03-30") }
    const project = await controller.update("0", dto);
    expect(mockCollaboratorsProjects.collaborator_project[0].begin).toBe(project.begin)
    expect(mockCollaboratorsProjects.collaborator_project[0].end).toBe(project.end)
  });

  it('should update a specif collaborator-project by id - changing same project for another date', async () => {
    const dto = { begin: new Date("2030-02-23"), end: new Date("2030-03-30") }
    const project = await controller.update("0", dto);
    expect(mockCollaboratorsProjects.collaborator_project[0].begin).toBe(project.begin)
    expect(mockCollaboratorsProjects.collaborator_project[0].end).toBe(project.end)
  });
  //begin: new Date("2022-01-01"),
  //end: new Date("2022-01-23")
  it('should not update a specif collaborator-project by id -  new relation begin is inside another registered different one', async () => {
    const dto = { begin: new Date("2022-01-02"), end: new Date("2022-04-01") }
    await expect(controller.update("0", dto)).rejects.toThrow()
  });

  it('should not update a specif collaborator-project by id -  new relation end is inside another registered different one', async () => {
    const dto = { begin: new Date("2021-12-30"), end: new Date("2022/01/20") }
    await expect(controller.update("0", dto)).rejects.toThrow()
  });

  it('should not update a specif collaborator-project by id - collaborator is in another project outside the whole given period', async () => {
    const dto = { begin: new Date("2021-12-30"), end: new Date("2022-04-01") }
    await expect(controller.update("0", dto)).rejects.toThrow()
  });

  it('should not update a specif collaborator-project by id - collaborator is in another project inside the whole given period', async () => {
    const dto = { begin: new Date("2021-02-23"), end: new Date("2022-03-29") }
    await expect(controller.update("0", dto)).rejects.toThrow()
  });

  it('should not update a specif collaborator-project by id - association ID not exists', async () => {
    const dto = { begin: new Date("2050-02-20"), end: new Date("2050/04/01") }
    await expect(controller.update("xxx", dto)).rejects.toThrow()
  });

  it('should delete a specif collaborator-project by id', async () => {
    const id = "1";
    const response = await controller.remove(id);
    expect(response.deletedCount).toBe(1)
    const searchDeletedRelation = mockCollaboratorsProjects.collaborator_project.find(element => element.id == id)
    expect(searchDeletedRelation).toBe(undefined)
  });

  it('should not delete a specif collaborator-project by id', async () => {
    await expect(controller.remove("zzzz")).rejects.toThrow() //ID NOT FOUND...
  });

  it('should return a specif collaborator-project by collaborators id', async () => {
    const idCollaborator = "0"
    const projectsByCollaborator = await controller.findManyByCollaborator(idCollaborator);
    const expectedLength = mockCollaboratorsProjects.collaborator_project.filter(el => el.collaborator_id == idCollaborator).length
    expect(projectsByCollaborator.length).toBe(expectedLength)
  });

  it('should return a specif collaborator-project by collaboratorsId - collaboratorId not exists, must return empty', async () => {
    const idCollaborator = "x"
    const projectsByCollaborator = await controller.findManyByCollaborator(idCollaborator);
    expect(projectsByCollaborator.length).toBe(0)
  });

  it('should return a specif collaborator-project by projectId', async () => {
    const idProject = "0"
    const collaboratorsByProject = await controller.findManyByProject(idProject);
    const expectedLength = mockCollaboratorsProjects.collaborator_project.filter(el => el.project_id == idProject).length
    expect(collaboratorsByProject.length).toBe(expectedLength)
  });

  it('should return a specif collaborator-project by projectId - projectId not exists, must return empty', async () => {
    const idProject = "x"
    const collaboratorsByProject = await controller.findManyByProject(idProject);
    expect(collaboratorsByProject.length).toBe(0)
  });
});

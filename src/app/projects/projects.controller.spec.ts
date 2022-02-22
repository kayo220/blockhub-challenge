import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

describe('ProjectsController', () => {
  let controller: ProjectsController;

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
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [ProjectsService],
    }).overrideProvider(ProjectsService).useValue(mockProjectService).compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a project', async () => {
    const dto = { name: "new challenge", description: "its description", begin: new Date("2002-02-03"), end: new Date("2002-03-03") }
    const response = await controller.create(dto)
    expect(response).toEqual({
      _id: mockProjectService.projects.length - 1,//simulate the created id
      name: dto.name,
      description: dto.description,
      begin: dto.begin,
      end: dto.end,
      active: true
    });
    expect(mockProjectService.projects[mockProjectService.projects.length - 1]._id).toBe(response._id)//verify if id is right and object is inserted
    expect(mockProjectService.create).toHaveBeenCalledWith(dto)
  });

  it('should not create a project - project already exists', async () => {
    const dto = { name: "new challenge", description: "its description", begin: new Date("2002-02-03"), end: new Date("2002-03-03") }
    await expect(controller.create(dto)).rejects.toThrow() //insert project with same register... should throw an httpexception
    expect(mockProjectService.create)
  });

  it('should return all projects', async () => {
    const allUsers = await controller.findAll();
    expect(allUsers.length).toBe(mockProjectService.projects.length)
    expect(mockProjectService.findAll)
  });

  it('should return a specif project by id', async () => {
    const project = await controller.findOne("0");
    expect(mockProjectService.projects[0]._id).toBe(project._id)
    expect(mockProjectService.findOne)

  });
  it('should not return a specif project by id - project not exists', async () => {
    await expect(controller.findOne("zzzz")).rejects.toThrow() //ID NOT FOUND...
    expect(mockProjectService.findOne)
  });

  it('should update a specif project by id', async () => {
    const dto = { name: "BlockHub Challenge2", description: "its description", begin: new Date("2002-02-03"), end: new Date("2002-03-03"), active: false }
    const project = await controller.update("0", dto);
    expect(mockProjectService.projects[0]._id).toBe(project._id)
    expect(mockProjectService.projects[0].active).toBe(false)
    expect(mockProjectService.projects[0].name).toBe(project.name)
    expect(mockProjectService.projects[0].begin).toBe(project.begin)
    expect(mockProjectService.projects[0].end).toBe(project.end)

    expect(mockProjectService.update)
  });

  it('should not update a specif project by id - project not exists', async () => {
    const dto = { name: "blockgub challenge", description: "its description", begin: new Date("2002-02-03"), end: new Date("2002-03-03"), active: false }
    await expect(controller.update("zzzz", dto)).rejects.toThrow() //ID NOT FOUND...
    expect(mockProjectService.update)
  });

  it('should not update a specif project by id - new given name already exists', async () => {
    const dto = { name: "URI challenge", description: "its description", begin: new Date("2002-02-03"), end: new Date("2002-03-03"), active: false }
    await expect(controller.update("zzzz", dto)).rejects.toThrow() //ID NOT FOUND...
    expect(mockProjectService.update)
  });


  it('should delete a specif project by id', async () => {
    const id = "1";
    const response = await controller.remove(id);
    expect(response.deletedCount).toBe(1)
    const searchDeletedUser = mockProjectService.projects.find(element => element.id == id)
    expect(searchDeletedUser).toBe(undefined)
    expect(mockProjectService.remove)
  });

  it('should not delete a specif project by id - project not exists', async () => {
    await expect(controller.remove("zzzz")).rejects.toThrow() //ID NOT FOUND...
    expect(mockProjectService.remove)
  });
});

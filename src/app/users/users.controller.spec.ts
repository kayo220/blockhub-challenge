import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUserService = {
    id: 1,
    users: [{
      _id: "0",
      username: "kayo",
      password: "123456",
      active: true
    }, {
      _id: "1",
      username: "pedro",
      password: "123456",
      active: true
    }],
    create: jest.fn(dto => {
      const newUser = {
        _id: ++mockUserService.id,
        username: dto.username,
        active: !dto.active ? true : dto.active
      }
      mockUserService.users.push(newUser);
      return newUser
    }),
    searchUserByUsername: jest.fn(username => {
      const filterUsers = mockUserService.users.filter(user => user.username == username)
      return filterUsers.length == 0 ? null : filterUsers[0]
    }),
    findAll: jest.fn(() => {
      return mockUserService.users
    }),
    findOne: jest.fn(id => {
      const user = mockUserService.users.find(element => element._id == id)
      return user
    }),
    update: jest.fn((id, dto) => {
      const index = mockUserService.users.findIndex(element => element._id == id);
      if (index == -1) {
        return null
      }
      mockUserService.users[index].password = !dto.password ? mockUserService.users[index].password : dto.password
      mockUserService.users[index].active = dto.active == undefined ? mockUserService.users[index].active : dto.active
      return mockUserService.users[index];
    }),
    remove: jest.fn(id => {
      const findUser = mockUserService.findOne(id)
      if (!findUser) {
        return null
      }
      mockUserService.users = mockUserService.users.filter(element => element.id != id)//remove the element from the array
      return { deletedCount: 1 };//simulate mongoose return for remove
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).overrideProvider(UsersService).useValue(mockUserService).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = { username: "kayo2", password: "!@DSAfas32a1" }
    const response = await controller.create(dto)
    expect(response).toEqual({
      _id: mockUserService.users.length - 1,//simulate the created id
      username: dto.username,
      active: true
    });
    expect(mockUserService.users[mockUserService.users.length - 1]._id).toBe(response._id)//verify if id is right and object is inserted
    expect(mockUserService.create).toHaveBeenCalledWith(dto)
  });

  it('should not create a user - user already exists', async () => {
    const dto = { username: "kayo", password: "123456" }
    await expect(controller.create(dto)).rejects.toThrow() //insert user with same register... should throw an httpexception
    expect(mockUserService.create)
  });

  it('should return all users', async () => {
    const allUsers = await controller.findAll();
    expect(allUsers.length).toBe(mockUserService.users.length)
    expect(mockUserService.findAll)
  });

  it('should return a specif user by id', async () => {
    const user = await controller.findOne("0");
    expect(mockUserService.users[0]._id).toBe(user._id)
    expect(mockUserService.findOne)

  });
  it('should not return a specif user by id - user not exists', async () => {
    await expect(controller.findOne("zzzz")).rejects.toThrow() //ID NOT FOUND...
    expect(mockUserService.findOne)
  });

  it('should update a specif user by id', async () => {
    const dto = { password: "teste2", active: false }
    const user = await controller.update("0", dto);
    expect(mockUserService.users[0]._id).toBe(user._id)
    expect(mockUserService.users[0].active).toBe(false)
    expect(mockUserService.update)
  });

  it('should not update a specif user by id - user not exists', async () => {
    const dto = { password: "teste2", active: false }
    await expect(controller.update("zzzz", dto)).rejects.toThrow() //ID NOT FOUND...
    expect(mockUserService.update)
  });

  it('should delete a specif user by id', async () => {
    const id = "1";
    const response = await controller.remove(id);
    expect(response.deletedCount).toBe(1)
    const searchDeletedUser = mockUserService.users.find(element => element.id == id)
    expect(searchDeletedUser).toBe(undefined)
    expect(mockUserService.remove)
  });

  it('should not delete a specif user by id - user not exists', async () => {
    await expect(controller.remove("zzzz")).rejects.toThrow() //ID NOT FOUND...
    expect(mockUserService.remove)
  });
});

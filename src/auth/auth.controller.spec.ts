import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService = {
    login: jest.fn(user => {
      return { token: "token" };
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService]
    }).overrideProvider(AuthService).useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  it('should be able to login', async () => {
    expect(await controller.login({ username: "kayo", password: "123456" })).toEqual({
      token: "token"
    });
    expect(mockAuthService.login)
  });

});

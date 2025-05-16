import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with the correct DTO', async () => {
      const registerUserDto = { email: 'test@example.com', password: 'Password123!', confirmPassword: 'Password123!' };
      const expectedResponse = { message: 'Vendedor registrago exitosamente.', userId: 'some-uuid' };
      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(registerUserDto);

      expect(service.register).toHaveBeenCalledWith(registerUserDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('login', () => {
    it('should call authService.login and return an access token', async () => {
      const loginUserDto = { email: 'test@example.com', password: 'Password123!' };
      const tokenResponse = { accesToken: 'mockAccessToken' }; // 'accesToken' con una 's'
      mockAuthService.login.mockResolvedValue(tokenResponse);

      const result = await controller.login(loginUserDto);
      expect(service.login).toHaveBeenCalledWith(loginUserDto);
      expect(result).toEqual(tokenResponse);
    });
  });
});
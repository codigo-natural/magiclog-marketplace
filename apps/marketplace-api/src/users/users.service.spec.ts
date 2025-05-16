import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserRole } from '../common/enums/role.enum';

const mockUserRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const mockUser: User = { id: '1', email, passwordHash: 'hash', role: UserRole.SELLER, createdAt: new Date(), updatedAt: new Date(), products: [] };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail(email);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const id = '1';
      const mockUser: User = { id, email: 'test@example.com', passwordHash: 'hash', role: UserRole.SELLER, createdAt: new Date(), updatedAt: new Date(), products: [] };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      
      const result = await service.findById(id);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByRole', () => {
    it('should find users by role', async () => {
      const role = UserRole.SELLER;
      const mockUsers: User[] = [
        { id: '1', email: 'seller1@example.com', passwordHash: 'h', role, createdAt: new Date(), updatedAt: new Date(), products: [] },
      ];
      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findByRole(role);
      expect(repository.find).toHaveBeenCalledWith({ where: { role } });
      expect(result).toEqual(mockUsers);
    });
  });
});
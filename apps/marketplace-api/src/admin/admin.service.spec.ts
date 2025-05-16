// src/admin/admin.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '../common/enums/role.enum';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

// Mock de ProductsService
const mockProductsService = {
  findAll: jest.fn(),
};

// Mock de UsersService
const mockUsersService = {
  findByRole: jest.fn(),
};

describe('AdminService', () => {
  let service: AdminService;
  let productsService: ProductsService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    productsService = module.get<ProductsService>(ProductsService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should call productsService.findAll with a sellerId', async () => {
      const sellerId = 'test-seller-id';
      const mockProdArray: Product[] = [];
      mockProductsService.findAll.mockResolvedValue(mockProdArray);
      await service.getAllProducts(sellerId);
      expect(productsService.findAll).toHaveBeenCalledWith(sellerId);
    });
  });

  describe('getAllSellers', () => {
    it('should call usersService.findByRole and return mapped sellers', async () => {
      const mockUserArray: User[] = [
        { id: '1', email: 'seller1@example.com', passwordHash: 'h', role: UserRole.SELLER, createdAt: new Date(), updatedAt: new Date(), products: [] },
      ];
      (usersService.findByRole as jest.Mock).mockResolvedValue(mockUserArray);

      const result = await service.getAllSellers();
      expect(usersService.findByRole).toHaveBeenCalledWith(UserRole.SELLER);
      expect(result).toEqual([{ id: '1', email: 'seller1@example.com' }]);
    });
  });
});
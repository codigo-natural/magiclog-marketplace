import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDTo } from './dto/create-product.dto';
import { SearchProductQueryDto } from './dto/search-product-query.dto';
import { User } from '../users/user.entity';
import { UserRole } from '../common/enums/role.enum';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    findOwn: jest.fn(),
    search: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.SELLER,
    products: [],
  };

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    sku: 'TEST-123',
    quantity: 10,
    price: 99.99,
    seller: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDTo = {
        name: 'Test Product',
        sku: 'TEST-123',
        quantity: 10,
        price: 99.99,
      };

      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDto, {
        user: mockUser,
      });

      expect(result).toEqual(mockProduct);
      expect(service.create).toHaveBeenCalledWith(createProductDto, mockUser);
    });
  });

  describe('getMyProducts', () => {
    it('should return products owned by the seller', async () => {
      const mockProducts = [mockProduct];
      mockProductsService.findOwn.mockResolvedValue(mockProducts);

      const result = await controller.getMyProducts({ user: mockUser });

      expect(result).toEqual(mockProducts);
      expect(service.findOwn).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('searchProducts', () => {
    it('should return products matching search criteria', async () => {
      const searchQuery: SearchProductQueryDto = {
        name: 'Test',
        minPrice: 50,
        maxPrice: 100,
      };

      const mockProducts = [mockProduct];
      mockProductsService.search.mockResolvedValue(mockProducts);

      const result = await controller.searchProducts(searchQuery);

      expect(result).toEqual(mockProducts);
      expect(service.search).toHaveBeenCalledWith(searchQuery);
    });

    it('should handle empty search criteria', async () => {
      const searchQuery: SearchProductQueryDto = {};
      const mockProducts = [mockProduct];
      mockProductsService.search.mockResolvedValue(mockProducts);

      const result = await controller.searchProducts(searchQuery);

      expect(result).toEqual(mockProducts);
      expect(service.search).toHaveBeenCalledWith(searchQuery);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const productId = '1';
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.getProductById(productId);

      expect(result).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith(productId);
    });

    it('should handle non-existent product', async () => {
      const productId = '999';
      mockProductsService.findOne.mockResolvedValue(null);

      const result = await controller.getProductById(productId);

      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith(productId);
    });
  });
});

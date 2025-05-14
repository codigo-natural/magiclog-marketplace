import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { User } from '../users/user.entity';
import { CreateProductDTo } from './dto/create-product.dto';
import { SearchProductQueryDto } from './dto/search-product-query.dto';
import { UserRole } from '../common/enums/role.enum';
import { Repository } from 'typeorm';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  const mockUser: Partial<User> = {
    id: '1',
    email: 'test@example.com',
    role: UserRole.SELLER,
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
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDTo = {
        name: 'Test Product',
        sku: 'TEST-123',
        quantity: 10,
        price: 99.99,
      };

      mockProductRepository.create.mockReturnValue(mockProduct);
      mockProductRepository.save.mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto, mockUser as User);

      expect(result).toEqual(mockProduct);
      expect(productRepository.create).toHaveBeenCalledWith({
        ...createProductDto,
        seller: mockUser,
      });
      expect(productRepository.save).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('findOwn', () => {
    it('should return products owned by a seller', async () => {
      const mockProducts = [mockProduct];
      mockProductRepository.find.mockResolvedValue(mockProducts);

      const result = await service.findOwn(mockUser.id);

      expect(result).toEqual(mockProducts);
      expect(productRepository.find).toHaveBeenCalledWith({
        where: { seller: { id: mockUser.id } },
      });
    });
  });

  describe('search', () => {
    it('should search products with all criteria', async () => {
      const searchQuery: SearchProductQueryDto = {
        name: 'Test',
        sku: 'TEST',
        minPrice: 50,
        maxPrice: 100,
      };

      const mockProducts = [mockProduct];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockProducts),
      };

      mockProductRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.search(searchQuery);

      expect(result).toEqual(mockProducts);
      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(3);
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });

    it('should search products with partial criteria', async () => {
      const searchQuery: SearchProductQueryDto = {
        name: 'Test',
      };

      const mockProducts = [mockProduct];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockProducts),
      };

      mockProductRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.search(searchQuery);

      expect(result).toEqual(mockProducts);
      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const productId = '1';
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.findOne(productId);

      expect(result).toEqual(mockProduct);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
      });
    });

    it('should return null for non-existent product', async () => {
      const productId = '999';
      mockProductRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(productId);

      expect(result).toBeNull();
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
      });
    });
  });
});

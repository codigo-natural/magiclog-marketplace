import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { User } from '../users/user.entity';
import { CreateProductDTo } from './dto/create-product.dto';
import { SearchProductQueryDto } from './dto/search-product-query.dto';
import { UserRole } from '../common/enums/role.enum';
import { Repository, Like, Between, FindManyOptions } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    role: UserRole.SELLER,
    passwordHash: 'hashed',
    createdAt: new Date(),
    updatedAt: new Date(),
    products: [],
  };

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    sku: 'TEST-123',
    quantity: 10,
    price: 99.99,
    seller: mockUser,
    sellerId: mockUser.id,
    createdAt: new Date(),
    updatedAt: new Date(),
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
    it('should create a new product if SKU does not exist', async () => {
      const createProductDto: CreateProductDTo = {
        name: 'Test Product',
        sku: 'NEW-SKU-456',
        quantity: 10,
        price: 99.99,
      };

      mockProductRepository.findOne.mockResolvedValue(null);
      const createdProductInstance = { ...createProductDto, seller: mockUser, sellerId: mockUser.id, id: 'new-id', createdAt: new Date(), updatedAt: new Date() };
      mockProductRepository.create.mockReturnValue(createdProductInstance);
      mockProductRepository.save.mockResolvedValue(createdProductInstance);

      const result = await service.create(createProductDto, mockUser);

      expect(productRepository.findOne).toHaveBeenCalledWith({ where: { sku: createProductDto.sku } });
      expect(productRepository.create).toHaveBeenCalledWith({
        ...createProductDto,
        seller: mockUser,
        sellerId: mockUser.id,
      });
      expect(productRepository.save).toHaveBeenCalledWith(createdProductInstance);
      expect(result).toEqual(createdProductInstance);
    });

    it('should throw ConflictException if product with SKU already exists', async () => {
      const createProductDto: CreateProductDTo = {
        name: 'Test Product',
        sku: 'EXISTING-SKU-123',
        quantity: 10,
        price: 99.99,
      };
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      await expect(service.create(createProductDto, mockUser)).rejects.toThrow(ConflictException);
      await expect(service.create(createProductDto, mockUser)).rejects.toThrow(
        `Ya existe un producto con el SKU: ${createProductDto.sku}`
      );
      expect(productRepository.create).not.toHaveBeenCalled();
      expect(productRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findOwn', () => {
    it('should return products owned by a seller', async () => {
      const mockProducts = [mockProduct];
      mockProductRepository.find.mockResolvedValue(mockProducts);

      const result = await service.findOwn(mockUser.id);

      expect(result).toEqual(mockProducts);
      expect(productRepository.find).toHaveBeenCalledWith({
        where: {
          sellerId: mockUser.id,
        },
        relations: ['seller'],
      });
    });
  });

  describe('findAll', () => {
    it('should return all products without sellerIdFilter', async () => {
      const mockProducts = [mockProduct, { ...mockProduct, id: '2', sellerId: 'another-seller' }];
      mockProductRepository.find.mockResolvedValue(mockProducts);
      const result = await service.findAll();
      expect(productRepository.find).toHaveBeenCalledWith({ relations: ['seller'] });
      expect(result).toEqual(mockProducts);
    });

    it('should return products filtered by sellerId if provided', async () => {
      const sellerIdFilter = 'specific-seller-id';
      const mockFilteredProducts = [mockProduct];
      mockProductRepository.find.mockResolvedValue(mockFilteredProducts);

      const result = await service.findAll(sellerIdFilter);

      expect(productRepository.find).toHaveBeenCalledWith({
        where: { sellerId: sellerIdFilter },
        relations: ['seller'],
      });
      expect(result).toEqual(mockFilteredProducts);
    });
  });


  describe('search', () => {
    const mockSearchResult: Product[] = [mockProduct];

    beforeEach(() => {
      (productRepository.find as jest.Mock).mockResolvedValue(mockSearchResult);
    });

    it('should search products with all criteria', async () => {
      const query: SearchProductQueryDto = {
        name: 'Test',
        sku: 'SKU1',
        minPrice: 10,
        maxPrice: 100,
      };

      const result = await service.search(query);

      expect(result).toEqual(mockSearchResult);
      expect(productRepository.find).toHaveBeenCalledWith({
        where: {
          name: Like('%Test%'),
          sku: Like('%SKU1%'),
          price: Between(10, 100),
        },
        relations: ['seller'],
      });
    });

    it('should search products with partial criteria (only name)', async () => {
      const query: SearchProductQueryDto = { name: 'Laptop' };

      const result = await service.search(query);

      expect(result).toEqual(mockSearchResult);
      expect(productRepository.find).toHaveBeenCalledWith({
        where: {
          name: Like('%Laptop%'),
        },
        relations: ['seller'],
      });
    });

    it('should handle minPrice only', async () => {
      const query: SearchProductQueryDto = { minPrice: 50 };
      await service.search(query);
      expect(productRepository.find).toHaveBeenCalledWith({
        where: { price: Between(50, Number.MAX_SAFE_INTEGER) },
        relations: ['seller'],
      });
    });

    it('should handle maxPrice only', async () => {
      const query: SearchProductQueryDto = { maxPrice: 200 };
      await service.search(query);
      expect(productRepository.find).toHaveBeenCalledWith({
        where: { price: Between(0, 200) },
        relations: ['seller'],
      });
    });

    it('should handle empty query by returning all products', async () => {
      const query: SearchProductQueryDto = {};
      await service.search(query);
      expect(productRepository.find).toHaveBeenCalledWith({
        where: {},
        relations: ['seller'],
      });
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
        relations: ['seller'],
      });
    });

    it('should throw NotFoundException for non-existent product', async () => {
      const productId = '999';
      (productRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(productId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(productId)).rejects.toThrow(
        `Producto con ID "${productId}" no encontrado.`,
      );
    });
  });
});
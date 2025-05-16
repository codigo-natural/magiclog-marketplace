import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Between, FindManyOptions, Like, Repository } from 'typeorm';
import { CreateProductDTo } from './dto/create-product.dto';
import { User } from 'src/users/user.entity';
import { SearchProductQueryDto } from './dto/search-product-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDTo, seller: User): Promise<Product> {
    const { name, sku, quantity, price } = createProductDto;

    // verificar si ya existe un producto con el mismo SKU
    const existingProduct = await this.productRepository.findOne({
      where: { sku },
    });
    if (existingProduct) {
      throw new ConflictException(`Ya existe un producto con el SKU: ${sku}`);
    }

    const product = this.productRepository.create({
      name,
      sku,
      quantity,
      price,
      sellerId: seller.id, // Asocia el producto al vendedor
      seller: seller,
    });

    try {
      return await this.productRepository.save(product);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al crear el producto');
    }
  }

  async findOwn(sellerId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { sellerId },
      relations: ['seller'],
    });
  }

  async findAll(sellerIdFilter?: string): Promise<Product[]> {
    const options: FindManyOptions<Product> = {
      relations: ['seller'],
    };
    if (sellerIdFilter) {
      options.where = { sellerId: sellerIdFilter };
    }
    return this.productRepository.find(options);
  }

  async search(query: SearchProductQueryDto): Promise<Product[]> {
    const { name, sku, minPrice, maxPrice } = query;
    const whereConditions: any = {};

    if (name) {
      whereConditions.name = Like(`%${name}%`);
    }
    if (sku) {
      whereConditions.sku = Like(`%${sku}%`);
    }
    if (minPrice !== undefined && maxPrice !== undefined) {
      whereConditions.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      whereConditions.price = Between(minPrice, Number.MAX_SAFE_INTEGER);
    } else if (maxPrice !== undefined) {
      whereConditions.price = Between(0, maxPrice);
    }

    return this.productRepository.find({
      where: whereConditions,
      relations: ['seller'],
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['seller'],
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado.`);
    }
    return product;
  }
}

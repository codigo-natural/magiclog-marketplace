import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/product.entity';

@Injectable()
export class AdminService {
  constructor(private readonly productsService: ProductsService) { }

  async getAllProducts(sellerIdFilter?: string): Promise<Product[]> {
    return this.productsService.findAll(sellerIdFilter);
  }
  // Aca podria ir mas logica especifica de admin, como gestion de usuarios, etc.
}

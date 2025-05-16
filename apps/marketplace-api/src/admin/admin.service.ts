import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/product.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { UserRole } from 'src/common/enums/role.enum';

export class SellerResponseDto {
  id: string;
  email: string;
}

@Injectable()
export class AdminService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) { }

  async getAllProducts(sellerIdFilter?: string): Promise<Product[]> {
    return this.productsService.findAll(sellerIdFilter);
  }
  async getAllSellers(): Promise<SellerResponseDto[]> {
    const sellers = await this.usersService.findByRole(UserRole.SELLER);
  
    return sellers.map(seller => ({
      id: seller.id,
      email: seller.email,
    }))
  }
}

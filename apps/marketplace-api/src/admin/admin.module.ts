import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ProductsModule, AuthModule, UsersModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }

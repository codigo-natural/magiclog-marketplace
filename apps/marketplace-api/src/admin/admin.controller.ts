import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRole } from 'src/common/enums/role.enum';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)  // protejer todas las rutas del admin
@Roles(UserRole.ADMIN) // Solo rol ADMIN puede acceder
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('products')
  async getAllProducts(@Query('sellerId') sellerId?: string) {
    return this.adminService.getAllProducts(sellerId);
  }
}

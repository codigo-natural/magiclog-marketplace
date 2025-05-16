import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService, SellerResponseDto } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRole } from 'src/common/enums/role.enum';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductResponseDto } from 'src/products/dto/product-response.dto';

@ApiTags('Admin Management')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('products')
  @ApiOperation({
    summary: 'Admin: Get all products',
    description: 'Retrieves all products in the platform. can be filtered by seller.',
  })
  @ApiQuery({
    name: 'sellerId',
    required: false,
    description: 'Optional:  Filter products by seller ID (UUID)',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all products (potentially filtered)',
    type: [ProductResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token missing or invalid' })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not an Admin' })
  async getAllProducts(@Query('sellerId') sellerId?: string) {
    return this.adminService.getAllProducts(sellerId);
  }

  @Get('sellers')
  @ApiOperation({
    summary: 'Admin: Get all sellers',
    description: 'Retrieves a list of all users with the "seller" role.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of sellers',
    type: [SellerResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token missing or invalid',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not an Admin' })
  async getAllSellers() {
    return this.adminService.getAllSellers();
  }

}

import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRole } from 'src/common/enums/role.enum';
import { CreateProductDTo } from './dto/create-product.dto';
import { User } from 'src/users/user.entity';
import { SearchProductQueryDto } from './dto/search-product-query.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @ApiOperation({
    summary: 'Crear un nuevo producto',
    description:
      'Crea un nuevo producto en el marketplace. Requiere autenticación y rol de vendedor o administrador.',
  })
  @ApiBearerAuth()
  @ApiBody({
    type: CreateProductDTo,
    description: 'Datos del producto a crear',
    examples: {
      example1: {
        value: {
          name: 'Smartphone XYZ',
          sku: 'SP-XYZ-123',
          quantity: 10,
          price: 999.99,
        },
        summary: 'Ejemplo de creación de producto',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'El producto ha sido creado exitosamente',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Smartphone XYZ',
        sku: 'SP-XYZ-123',
        quantity: 10,
        price: 999.99,
        seller: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          email: 'vendedor@example.com',
          role: 'SELLER',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT inválido o expirado',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'No tiene permisos para crear productos - Se requiere rol SELLER o ADMIN',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
      },
    },
  })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  async create(@Body() createProductDto: CreateProductDTo, @Req() req: any) {
    const seller: User = req.user;
    return this.productsService.create(createProductDto, seller);
  }

  @ApiOperation({
    summary: 'Obtener los productos del vendedor actual',
    description:
      'Retorna la lista de productos creados por el vendedor autenticado. Requiere autenticación y rol de vendedor.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Lista de productos del vendedor',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Smartphone XYZ',
          sku: 'SP-XYZ-123',
          quantity: 10,
          price: 999.99,
          seller: {
            id: '123e4567-e89b-12d3-a456-426614174001',
            email: 'vendedor@example.com',
            role: 'SELLER',
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT inválido o expirado',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'No tiene permisos para ver sus productos - Se requiere rol SELLER',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
      },
    },
  })
  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async getMyProducts(@Req() req: any) {
    const seller: User = req.user;
    return this.productsService.findOwn(seller.id);
  }

  @ApiOperation({
    summary: 'Buscar productos',
    description: 'Busca productos según criterios de búsqueda. No requiere autenticación.',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Nombre del producto a buscar',
    type: String,
    example: 'Smartphone',
  })
  @ApiQuery({
    name: 'sku',
    required: false,
    description: 'SKU del producto a buscar',
    type: String,
    example: 'SP-XYZ-123',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    description: 'Precio mínimo del producto',
    type: Number,
    example: 100,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    description: 'Precio máximo del producto',
    type: Number,
    example: 1000,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos que coinciden con los criterios de búsqueda',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Smartphone XYZ',
          sku: 'SP-XYZ-123',
          quantity: 10,
          price: 999.99,
          seller: {
            id: '123e4567-e89b-12d3-a456-426614174001',
            email: 'vendedor@example.com',
            role: 'SELLER',
          },
        },
      ],
    },
  })
  @Get('search')
  async searchProducts(@Query() query: SearchProductQueryDto) {
    return this.productsService.search(query);
  }

  @ApiOperation({
    summary: 'Obtener un producto por su ID',
    description:
      'Retorna los detalles de un producto específico por su ID. No requiere autenticación.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto (UUID)',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Smartphone XYZ',
        sku: 'SP-XYZ-123',
        quantity: 10,
        price: 999.99,
        seller: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          email: 'vendedor@example.com',
          role: 'SELLER',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product not found',
      },
    },
  })
  @Get(':id')
  async getProductById(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }
}

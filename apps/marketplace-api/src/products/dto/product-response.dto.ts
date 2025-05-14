import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'ID único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Smartphone XYZ',
    minLength: 3,
    maxLength: 100,
  })
  name: string;

  @ApiProperty({
    description: 'Código SKU único del producto',
    example: 'SP-XYZ-123',
    minLength: 5,
    maxLength: 20,
    pattern: '^[A-Z0-9-]+$',
  })
  sku: string;

  @ApiProperty({
    description: 'Cantidad disponible del producto',
    example: 10,
    minimum: 0,
    type: Number,
  })
  quantity: number;

  @ApiProperty({
    description: 'Precio del producto',
    example: 999.99,
    minimum: 0,
    type: Number,
    format: 'float',
  })
  price: number;

  @ApiProperty({
    description: 'ID del vendedor del producto',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid',
  })
  sellerId: string;

  @ApiProperty({
    description: 'Fecha de creación del producto',
    example: '2024-03-20T10:00:00Z',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del producto',
    example: '2024-03-20T10:00:00Z',
    format: 'date-time',
  })
  updatedAt: Date;
}

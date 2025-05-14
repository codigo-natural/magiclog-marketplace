import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchProductsDto {
  @ApiProperty({
    description: 'Nombre del producto a buscar',
    example: 'Smartphone',
    required: false,
    minLength: 2,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Código SKU del producto',
    example: 'SP-XYZ-123',
    required: false,
    minLength: 5,
    maxLength: 20,
    pattern: '^[A-Z0-9-]+$',
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    description: 'Precio mínimo del producto',
    example: 100,
    required: false,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El precio mínimo debe ser un número.' })
  @Min(0, { message: 'El precio mínimo no puede ser negativo.' })
  @Type(() => Number)
  minPrice?: number;

  @ApiProperty({
    description: 'Precio máximo del producto',
    example: 1000,
    required: false,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El precio máximo debe ser un número.' })
  @Min(0, { message: 'El precio máximo no puede ser negativo.' })
  @Type(() => Number)
  maxPrice?: number;
}

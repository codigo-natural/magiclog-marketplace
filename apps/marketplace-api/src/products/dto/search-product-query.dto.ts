import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchProductQueryDto {
  @ApiProperty({
    description: 'Nombre del producto a buscar',
    required: false,
    example: 'Smartphone',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'SKU del producto a buscar',
    required: false,
    example: 'SP-XYZ-123',
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    description: 'Precio mínimo del producto',
    required: false,
    minimum: 0,
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @ApiProperty({
    description: 'Precio máximo del producto',
    required: false,
    minimum: 0,
    example: 1000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;
}

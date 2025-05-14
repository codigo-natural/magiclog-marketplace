import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDTo {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Smartphone XYZ',
    minLength: 3,
    maxLength: 100,
    required: true,
  })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio.' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Código SKU único del producto',
    example: 'SP-XYZ-123',
    minLength: 5,
    maxLength: 20,
    required: true,
    pattern: '^[A-Z0-9-]+$',
  })
  @IsNotEmpty({ message: 'El SKU no puede estar vacio.' })
  @IsString()
  sku: string;

  @ApiProperty({
    description: 'Cantidad disponible del producto',
    minimum: 0,
    example: 10,
    required: true,
    type: Number,
  })
  @IsNotEmpty({ message: 'La cantidad no puede estar vacia.' })
  @IsNumber({}, { message: 'La cantidad debe ser un número.' })
  @Min(0, { message: 'La cantidad no puede ser negativa.' })
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: 'Precio del producto',
    minimum: 0,
    example: 999.99,
    required: true,
    type: Number,
    format: 'float',
  })
  @IsNotEmpty({ message: 'El precio no puede estar vacío' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser un número con máximo 2 decimales.' },
  )
  @IsPositive({ message: 'El precio debe ser un número positivo.' })
  @Type(() => Number)
  price: number;
}

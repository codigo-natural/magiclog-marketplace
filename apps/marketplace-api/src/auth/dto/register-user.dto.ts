import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: 'vendedor@example.com',
    description: 'Email del usuario (debe ser un email válido)',
    required: true,
    format: 'email',
  })
  @IsNotEmpty({ message: 'El email no puede estar vacio.' })
  @IsEmail({}, { message: 'Debe ser un email valido.' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'Contraseña del usuario (mínimo 8 caracteres, debe contener mayúsculas, minúsculas y números o caracteres especiales)',
    required: true,
    minLength: 8,
    pattern: '/((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$/',
    format: 'password',
  })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacia.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número o caracter especial.',
  })
  password: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'Confirmación de la contraseña (debe coincidir con el campo password)',
    required: true,
    format: 'password',
  })
  @IsNotEmpty({
    message: 'La confirmación de contraseña no puede estar vacia.',
  })
  @IsString()
  confirmPassword: string;
}

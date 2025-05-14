import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'vendedor@example.com',
    description: 'Email del usuario registrado',
    required: true,
    format: 'email',
  })
  @IsNotEmpty({ message: 'El email no puede estar vacio.' })
  @IsEmail({}, { message: 'Debe ser un email válido.' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña del usuario',
    required: true,
    format: 'password',
  })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacia.' })
  @IsString()
  password: string;
}

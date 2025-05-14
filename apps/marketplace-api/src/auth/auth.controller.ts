import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({
    summary: 'Registrar un nuevo usuario (vendedor)',
    description:
      'Crea una nueva cuenta de vendedor en el marketplace. Requiere email y contraseña válidos.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente.',
    schema: {
      example: {
        message: 'Vendedor registrado exitosamente.',
        userId: '123e4567-e89b-12d3-a456-426614174000',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Las contraseñas no coinciden.',
          'El email debe ser un email válido.',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está registrado.',
    schema: {
      example: {
        statusCode: 409,
        message: 'El email ya está registrado.',
        error: 'Conflict',
      },
    },
  })
  @ApiBody({
    type: RegisterUserDto,
    examples: {
      example1: {
        value: {
          email: 'vendedor@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
        },
        summary: 'Ejemplo de registro exitoso',
      },
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión para usuarios (vendedores/administradores)',
    description:
      'Autentica a un usuario y retorna un token JWT para acceder a los recursos protegidos.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso, retorna token JWT.',
    schema: {
      example: {
        accesToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Credenciales inválidas.',
        error: 'Unauthorized',
      },
    },
  })
  @ApiBody({
    type: LoginUserDto,
    examples: {
      example1: {
        value: {
          email: 'vendedor@example.com',
          password: 'Password123!',
        },
        summary: 'Ejemplo de login exitoso',
      },
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}

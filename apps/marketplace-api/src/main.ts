import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { getRepositoryToken } from '@nestjs/typeorm';
import { seedAdmin } from './admin/scrypt-seed-create-admin';
import { User } from './users/user.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve propiedade no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no definidas
      transform: true, // Transforma payload a instancias de DTO
      transformOptions: {
        enableImplicitConversion: true, // Permite conversión implicita de tipos (ej. string de query a number)
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter()); // Aplicar filtro global

  const config = new DocumentBuilder()
    .setTitle('API marketplace')
    .setDescription(
      'Documentación de la API para la prueba técnica de marketplace',
    )
    .setVersion('1.0')
    .addBearerAuth() // para endpoints protejidos con JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // La UI de Swagger estará en /api-docs

  const userRepository = app.get(getRepositoryToken(User));
  await seedAdmin(userRepository);

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger docs available at: ${await app.getUrl()}/api-docs`);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  // npm i class-validator class-transformer

  /*
    *whitelist: true
    Elimina del objeto recibido cualquier propiedad que no esté en tu DTO. 
    *forbidNonWhitelisted: true
    En lugar de eliminar los campos extra, lanza un error si vienen propiedades no esperadas.
  */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

/**
 * Un Pipe es una función que transforma o valida datos antes de que lleguen a tu controlador.
  El ValidationPipe usa class-validator y class-transformer para:

  Validar DTOs (@IsString(), @IsEmail(), etc.)

  Transformar datos (ej: strings en números).
*/

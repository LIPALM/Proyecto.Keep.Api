import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            //Elimina propiedades que no están definidas en el DTO
    forbidNonWhitelisted: true, //Lanza un error si se envían propiedades no definidas en el DTO
    transform: true,            //Transforma los datos de entrada al tipo definido en el DTO
  }));

  const config = new DocumentBuilder()
    .setTitle('GoogleKeep API')
    .setDescription('Documentación de la API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  var port = 3000;
  await app.listen(port);
}
bootstrap();

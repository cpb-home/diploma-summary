import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http.exception.filter';
//import { ValidationPipe } from '@nestjs/common';
import { ValidationPipe } from './validation/validation.pipe';
//import { MongoExceptionFilter } from './filters/mongo.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:3001', methods: 'GET,POST', allowedHeaders: 'Content-Type,Accept', });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter); //new HttpExceptionFilter);
  await app.listen(process.env.SERVER_PORT ?? 3000);
}
bootstrap();

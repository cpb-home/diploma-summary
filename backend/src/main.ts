import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:3001', methods: 'GET,POST', allowedHeaders: 'Content-Type,Accept', });
  await app.listen(process.env.SERVER_PORT ?? 3000);
}
bootstrap();

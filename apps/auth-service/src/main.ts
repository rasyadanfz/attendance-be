import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  app.useGlobalPipes(new ValidationPipe({transform: true, forbidNonWhitelisted: true, whitelist: true}));
  await app.listen(process.env.port ?? 3001);
}
await bootstrap();

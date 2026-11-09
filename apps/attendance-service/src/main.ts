import { NestFactory } from '@nestjs/core';
import { AttendanceServiceModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AttendanceServiceModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3123',
      'http://localhost:3124',
    ],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
  });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3002);
}
await bootstrap();

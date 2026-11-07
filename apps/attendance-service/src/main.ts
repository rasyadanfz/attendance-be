import { NestFactory } from '@nestjs/core';
import { AttendanceServiceModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AttendanceServiceModule);
  app.useGlobalPipes(new ValidationPipe({transform: true, forbidNonWhitelisted: true, whitelist: true}));
  await app.listen(process.env.port ?? 3002);
}
await bootstrap();

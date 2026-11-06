import { NestFactory } from '@nestjs/core';
import { AttendanceServiceModule } from './attendance-service.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AttendanceServiceModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.port ?? 3002);
}
await bootstrap();

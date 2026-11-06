import { NestFactory } from '@nestjs/core';
import { EmployeeServiceModule } from './employee-service.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(EmployeeServiceModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.port ?? 3003);
}
await bootstrap();

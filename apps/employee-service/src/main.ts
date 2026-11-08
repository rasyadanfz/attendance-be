import { NestFactory } from '@nestjs/core';
import { EmployeeServiceModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(EmployeeServiceModule);
  app.useGlobalPipes(new ValidationPipe({transform: true, forbidNonWhitelisted: true, whitelist: true}));
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept']
  })
  app.setGlobalPrefix('api')
  await app.listen(process.env.PORT ?? 3003);
}
await bootstrap();

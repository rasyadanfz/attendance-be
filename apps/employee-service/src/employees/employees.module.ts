import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller.js';
import { EmployeesService } from './employees.service.js';
import { Employee } from './entities/employee.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpClientModule } from '@nestjs/http-client';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    HttpClientModule.registerAsync({
      name: 'auth-service',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseUrl: config.getOrThrow<string>('AUTH_SERVICE_URL'),
        timeout: 5000,
        retry: false,
      }),
    }),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeServiceController } from './employee-service.controller.js';
import { EmployeeServiceService } from './employee-service.service.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get("EMPLOYEE_DB_URL"),
        autoLoadEntities: true,
        synchronize: false,
        timezone: 'Z'
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [EmployeeServiceController],
  providers: [EmployeeServiceService],
})
export class EmployeeServiceModule {}

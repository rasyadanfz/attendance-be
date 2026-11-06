import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from './employees/employees.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.getOrThrow<string>("EMPLOYEE_DB_URL"),
        autoLoadEntities: true,
        synchronize: false,
        timezone: 'Z'
      }),
      inject: [ConfigService],
    }),
    EmployeesModule,
  ],
})
export class EmployeeServiceModule {}

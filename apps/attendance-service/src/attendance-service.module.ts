import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceServiceController } from './attendance-service.controller.js';
import { AttendanceServiceService } from './attendance-service.service.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get("ATTENDANCE_DB_URL"),
        autoLoadEntities: true,
        synchronize: false,
        timezone: 'Z'
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AttendanceServiceController],
  providers: [AttendanceServiceService],
})
export class AttendanceServiceModule {}

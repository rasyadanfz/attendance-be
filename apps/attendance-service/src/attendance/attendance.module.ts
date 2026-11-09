import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller.js';
import { AttendanceService } from './attendance.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity.js';
import { PhotoStorageModule } from '../photo-storage/photo-storage.module.js';
import { PhotoStorageService } from '../photo-storage/photo-storage.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance]), PhotoStorageModule],
  controllers: [AttendanceController],
  providers: [AttendanceService, PhotoStorageService],
})
export class AttendanceModule {}

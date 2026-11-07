import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance, AttendanceAction } from './entities/attendance.entity.js';
import { QueryFailedError, Repository } from 'typeorm';
import { PhotoStorageService } from '../photo-storage/photo-storage.service.js';

@Injectable()
export class AttendanceService {
    private timezone: string;

    constructor (
        @InjectRepository(Attendance)
        private attendanceRepository: Repository<Attendance>,

        private storage: PhotoStorageService
    ) {
        this.timezone = 'Asia/Jakarta'
    }

    async checkIn(employeeId: number, photo: Express.Multer.File) {
        const now = new Date()
        const workingDate = this.toWorkingDate(now)

        const hasCheckedIn = await this.attendanceRepository.exists(
        {
            where: {
                employeeId: employeeId,
                date: workingDate,
                action: AttendanceAction.CHECKIN
            }, 
        })
        if (hasCheckedIn) throw new ConflictException("you already checked-in today");

        // Save photo to storage
        const photoFilename = await this.storage.save(photo)

        try {
            const attendance = await this.attendanceRepository.save(
                this.attendanceRepository.create({
                    employeeId,
                    date: workingDate,
                    action: AttendanceAction.CHECKIN,
                    occuredAt: now,
                    photoFilename: photoFilename
                })
            )
        } catch (e) {
            // delete file on fail
            await this.storage.remove(photoFilename)

            if (e instanceof QueryFailedError && e.driverError.code === "ER_DUP_ENTRY") {
                throw new ConflictException("you already checked-in today")
            }

            throw e
        }
    }

    async checkOut(employeeId: number) {
        const now = new Date()
        const workingDate = this.toWorkingDate(now)

        const todayAttendances = await this.attendanceRepository.find(
        {
            where: {
                employeeId: employeeId,
                date: workingDate,
            },
            select: { action: true }
        })
        
        const hasCheckedIn = todayAttendances.some(r => r.action === AttendanceAction.CHECKIN)
        const hasCheckedOut = todayAttendances.some(r => r.action === AttendanceAction.CHECKOUT)

        if (!hasCheckedIn) throw new ConflictException("you have not checked-in today")
        if (hasCheckedOut) throw new ConflictException("you have already checked out today")

        try {
            const attendance = await this.attendanceRepository.save(
                this.attendanceRepository.create({
                    employeeId,
                    date: workingDate,
                    action: AttendanceAction.CHECKOUT,
                    occuredAt: now,
                })
            )
        } catch (e) {
            if (e instanceof QueryFailedError && e.driverError.code === "ER_DUP_ENTRY") {
                throw new ConflictException("you already checked-out today")
            }

            throw e
        }
    }

    // Helper
    private toWorkingDate(date: Date): string {
        return new Intl.DateTimeFormat('en-CA', {timeZone: this.timezone}).format(date)
    }
}

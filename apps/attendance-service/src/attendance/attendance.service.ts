import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance, AttendanceAction } from './entities/attendance.entity.js';
import { QueryFailedError, Repository } from 'typeorm';
import { PhotoStorageService } from '../photo-storage/photo-storage.service.js';
import { JwtUserData } from '@app/common';
import { access } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname } from 'node:path';

interface GetAttendancesFilters {
  page: number;
  limit: number;
  from?: string;
  to?: string;
  employeeIds?: number[];
  action?: AttendanceAction;
}

const photoMimeType: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
};

@Injectable()
export class AttendanceService {
  private timezone: string;

  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,

    private storage: PhotoStorageService,
  ) {
    this.timezone = 'Asia/Jakarta';
  }

  async checkIn(employeeId: number, photo: Express.Multer.File) {
    const now = new Date();
    const workingDate = this.toWorkingDate(now);

    const hasCheckedIn = await this.attendanceRepository.exists({
      where: {
        employeeId: employeeId,
        date: workingDate,
        action: AttendanceAction.CHECKIN,
      },
    });
    if (hasCheckedIn)
      throw new ConflictException('you already checked-in today');

    // Save photo to storage
    const photoFilename = await this.storage.save(photo);

    try {
      const attendance = await this.attendanceRepository.save(
        this.attendanceRepository.create({
          employeeId,
          date: workingDate,
          action: AttendanceAction.CHECKIN,
          occuredAt: now,
          photoFilename: photoFilename,
        }),
      );
    } catch (e) {
      // delete file on fail
      await this.storage.remove(photoFilename);

      if (
        e instanceof QueryFailedError &&
        e.driverError.code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('you already checked-in today');
      }

      throw e;
    }
  }

  async checkOut(employeeId: number) {
    const now = new Date();
    const workingDate = this.toWorkingDate(now);

    const todayAttendances = await this.attendanceRepository.find({
      where: {
        employeeId: employeeId,
        date: workingDate,
      },
      select: { action: true },
    });

    const hasCheckedIn = todayAttendances.some(
      (r) => r.action === AttendanceAction.CHECKIN,
    );
    const hasCheckedOut = todayAttendances.some(
      (r) => r.action === AttendanceAction.CHECKOUT,
    );

    if (!hasCheckedIn)
      throw new ConflictException('you have not checked-in today');
    if (hasCheckedOut)
      throw new ConflictException('you have already checked out today');

    try {
      const attendance = await this.attendanceRepository.save(
        this.attendanceRepository.create({
          employeeId,
          date: workingDate,
          action: AttendanceAction.CHECKOUT,
          occuredAt: now,
        }),
      );
    } catch (e) {
      if (
        e instanceof QueryFailedError &&
        e.driverError.code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('you already checked-out today');
      }

      throw e;
    }
  }

  async getToday(employeeId: number): Promise<{
    status: 'NOT_CHECKED_IN' | 'CHECKED_IN' | 'COMPLETE';
    time?: Date;
  }> {
    const attendances = await this.attendanceRepository.find({
      where: {
        employeeId: employeeId,
        date: this.toWorkingDate(new Date()),
      },
      select: { action: true, occuredAt: true },
    });

    const notCheckedIn = attendances.length === 0;
    if (notCheckedIn) return { status: 'NOT_CHECKED_IN' };

    const checkInRecord = attendances.find(
      (r) => r.action === AttendanceAction.CHECKIN,
    );
    const checkOutRecord = attendances.find(
      (r) => r.action === AttendanceAction.CHECKOUT,
    );

    if (checkOutRecord)
      return { status: 'COMPLETE', time: checkOutRecord.occuredAt };

    return { status: 'CHECKED_IN', time: checkInRecord?.occuredAt };
  }

  async getAll(filters: GetAttendancesFilters) {
    const { page, limit, from, to, employeeIds, action } = filters;
    if (from && to && from > to) {
      throw new BadRequestException('from must not be after to');
    }

    const ranked = this.attendanceRepository
      .createQueryBuilder('r')
      .select('r.id', 'id')
      .addSelect(
        `ROW_NUMBER() OVER (
         PARTITION BY r.employee_id, r.date
         ORDER BY r.occured_at DESC, r.id DESC
       )`,
        'rn',
      );

    if (from) ranked.andWhere('r.date >= :from', { from });
    if (to) ranked.andWhere('r.date <= :to', { to });
    if (employeeIds && employeeIds.length)
      ranked.andWhere('r.employee_id IN (:...ids)', { ids: employeeIds });

    const qb = this.attendanceRepository
      .createQueryBuilder('a')
      .innerJoin(
        `(${ranked.getQuery()})`,
        'latest',
        'latest.id = a.id AND latest.rn = 1',
      )
      .setParameters(ranked.getParameters());

    if (action) qb.andWhere('a.action = :action', { action });

    let [rows, total] = await qb
      .orderBy('a.date', 'DESC')
      .addOrderBy('a.employee_id', 'ASC')
      .limit(limit)
      .offset(limit * (page - 1))
      .getManyAndCount();

    let photoByKey = new Map<
      string,
      { filename: string; attendancePhotoHolderId: number } | null
    >();

    if (rows.length) {
      const ids = [...new Set(rows.map((r) => r.employeeId))];
      const dates = [...new Set(rows.map((r) => r.date))];

      const checkIns = await this.attendanceRepository
        .createQueryBuilder('c')
        .select([
          'c.employeeId',
          'c.date',
          'c.id',
          'c.photoFilename',
          'c.occuredAt',
        ])
        .where('c.employeeId IN (:...ids)', { ids })
        .andWhere('c.date IN (:...dates)', { dates })
        .andWhere('c.action = :checkIn', { checkIn: AttendanceAction.CHECKIN })
        .orderBy('c.occuredAt', 'ASC')
        .getMany();

      photoByKey = new Map(
        checkIns.map((c) => [
          `${c.employeeId}|${c.date}`,
          c.photoFilename
            ? { filename: c.photoFilename, attendancePhotoHolderId: c.id }
            : null,
        ]),
      );
    }

    let resultRows: Array<Attendance & { attendancePhotoHolderId?: number }>;
    resultRows = rows.map((r) => {
      const newRow: Attendance & { attendancePhotoHolderId?: number } = {
        ...r,
      };
      const photo = photoByKey.get(`${r.employeeId}|${r.date}`);
      if (photo) {
        newRow.photoFilename = photo.filename;
        newRow.attendancePhotoHolderId = photo.attendancePhotoHolderId;
      }

      return newRow;
    });

    return [resultRows, total];
  }

  async getPhoto(attendanceId: number, user: JwtUserData) {
    const attendance = await this.attendanceRepository.findOneBy({
      id: attendanceId,
      action: AttendanceAction.CHECKIN,
    });
    if (!attendance || !attendance.photoFilename)
      throw new NotFoundException('photo not found');

    const isFileOwner =
      user.role === 'employee' &&
      user.employee_id &&
      attendance.employeeId === user.employee_id;
    if (user.role !== 'hradmin' && !isFileOwner) throw new ForbiddenException();

    const path = this.storage.pathOf(attendance.photoFilename);
    try {
      await access(path);
    } catch (e) {
      throw new NotFoundException('photo is missing');
    }

    const fileStream = createReadStream(path);
    return new StreamableFile(fileStream, {
      type:
        photoMimeType[extname(path).toLowerCase()] ??
        'application/octet-stream',
      disposition: 'inline',
    });
  }

  // Helper
  private toWorkingDate(date: Date): string {
    return new Intl.DateTimeFormat('en-CA', { timeZone: this.timezone }).format(
      date,
    );
  }
}

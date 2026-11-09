import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  ForbiddenException,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  User,
  type JwtUserData,
} from '@app/common';
import { SubmitAttendanceDTO } from './dto/submitAttendance.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttendanceAction } from './entities/attendance.entity.js';
import { AttendanceService } from './attendance.service.js';
import { GetAllAttendancesDTO } from './dto/getAllAttendance.dto.js';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post()
  @Roles('employee')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('photo', { limits: { fileSize: 4 * 1024 * 1024 } }),
  )
  async submitAttendance(
    @User() user: JwtUserData,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 4 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png)$/ }),
        ],
      }),
    )
    photo: Express.Multer.File | undefined,
    @Body('action') action: string,
  ) {
    if (!user.employee_id) {
      throw new ForbiddenException('only employee can submit attendance');
    }

    if (!action) throw new BadRequestException('action body is required');
    let actionJson: any;
    try {
      actionJson = JSON.parse(action);
    } catch (e) {
      throw new BadRequestException('invalid JSON body for action field');
    }
    const actionDTO = plainToInstance(SubmitAttendanceDTO, actionJson);
    const errors = await validate(actionDTO);
    if (errors.length > 0) throw new BadRequestException(errors);

    if (actionDTO.action === AttendanceAction.CHECKIN) {
      if (!photo)
        throw new BadRequestException('photo is required to check in');
      await this.attendanceService.checkIn(user.employee_id, photo!);
    }

    if (actionDTO.action === AttendanceAction.CHECKOUT) {
      await this.attendanceService.checkOut(user.employee_id);
    }
  }

  @Get('today')
  @Roles('employee')
  async getToday(@User() user: JwtUserData) {
    if (!user.employee_id) {
      throw new ForbiddenException(
        'only employee can see their attendance status',
      );
    }

    return await this.attendanceService.getToday(user.employee_id);
  }

  @Get()
  @Roles('hradmin')
  async getAll(@Query() dto: GetAllAttendancesDTO) {
    const [result, count] = await this.attendanceService.getAll({ ...dto });

    return {
      attendances: result,
      count: count,
    };
  }

  @Get(':id/photo')
  @Roles('employee', 'hradmin')
  async getAttendancePhoto(
    @Param('id', ParseIntPipe) attendanceId: number,
    @User() user: JwtUserData,
  ) {
    const file = await this.attendanceService.getPhoto(attendanceId, user);
    return file;
  }
}

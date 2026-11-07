import { BadRequestException, Body, Controller, FileTypeValidator, ForbiddenException, Get, HttpCode, MaxFileSizeValidator, ParseFilePipe, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard, Roles, User, type JwtUserData } from '@app/common';
import { SubmitAttendanceDTO } from './dto/submitAttendance.dto.js';
import { FileInterceptor } from "@nestjs/platform-express"
import { AttendanceAction } from './entities/attendance.entity.js';
import { AttendanceService } from './attendance.service.js';
import { GetAllAttendancesDTO } from './dto/getAllAttendance.dto.js';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(FileInterceptor('photo', {limits: {fileSize: 4 * 1024 * 1024}}))
export class AttendanceController {
    constructor(private attendanceService: AttendanceService){}

    @Post()
    @Roles('employee')
    @HttpCode(200)
    async submitAttendance(
        @User() user: JwtUserData,
        @Body() dto: SubmitAttendanceDTO,
        @UploadedFile(
            new ParseFilePipe({
                fileIsRequired: false,
                validators: [
                    new MaxFileSizeValidator({maxSize: 4 * 1024 * 1024}),
                    new FileTypeValidator({fileType: /^image\/(jpeg|png)$/})
                ]
            })
        ) photo: Express.Multer.File | undefined
    ) {
        if (!user.employee_id) {
            throw new ForbiddenException("only employee can submit attendance")
        }

        if (dto.action === AttendanceAction.CHECKIN) {
            if (!photo) throw new BadRequestException("photo is required to check in")
            await this.attendanceService.checkIn(user.employee_id, photo!)
        }

        if (dto.action === AttendanceAction.CHECKOUT) {
            await this.attendanceService.checkOut(user.employee_id)
        }
    }

    @Get("today")
    @Roles('employee')
    async getToday(@User() user: JwtUserData) {
        if (!user.employee_id) {
            throw new ForbiddenException("only employee can see their attendance status")
        }

        return await this.attendanceService.getToday(user.employee_id)
    }

    @Get()
    @Roles("hradmin")
    async getAll(@User() user: JwtUserData, @Query() dto: GetAllAttendancesDTO) {
        const [result, count] = await this.attendanceService.getAll({...dto})
    }

}

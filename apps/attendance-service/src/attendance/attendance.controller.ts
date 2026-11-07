import { BadRequestException, Body, Controller, FileTypeValidator, ForbiddenException, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard, type JwtUserData } from '../custom-guards/jwt.guard.js';
import { RolesGuard } from '../custom-guards/role.guard.js';
import { Roles } from '../custom-decorators/role.decorator.js';
import { SubmitAttendanceDTO } from './dto/submitAttendance.dto.js';
import { FileInterceptor } from "@nestjs/platform-express"
import { User } from '../custom-decorators/user.decorator.js';
import { AttendanceAction } from './entities/attendance.entity.js';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(FileInterceptor('photo', {limits: {fileSize: 4 * 1024 * 1024}}))
export class AttendanceController {

    @Post()
    @Roles('employee')
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
        if (dto.action === AttendanceAction.CHECKIN && !photo) {
            throw new BadRequestException("photo is required to check in")
        }

        if (!user.employee_id) {
            throw new ForbiddenException("only employee can submit attendance")
        }
    }
}

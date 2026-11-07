import { IsEnum, IsIn, IsNotEmpty } from "class-validator"
import { AttendanceAction } from "../entities/attendance.entity.js"

export class SubmitAttendanceDTO {
    @IsNotEmpty()
    @IsEnum(AttendanceAction, {message: "action must be check_in or check_out"})
    action: AttendanceAction
}
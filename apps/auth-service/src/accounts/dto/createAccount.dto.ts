import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Max, MaxLength, MinLength } from "class-validator"
import { UserRole } from "../entities/account.entity.js"
import { Expose } from "class-transformer"

export class CreateAccountDTO {
    @Expose({name: "employee_id"})
    @IsNumber({}, {message: "employee_id must be a number"})
    @IsNotEmpty({message: "employee_id should not be empty"})
    employeeId: number

    @IsString()
    @IsNotEmpty()
    @MaxLength(70)
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(7)
    password: string

    @IsEnum(UserRole)
    role: UserRole

    @Expose({name: "is_active"})
    @IsNotEmpty({message: "is_active should not be empty"})
    @IsBoolean({message: "is_active must be a boolean"})
    isActive: boolean
}
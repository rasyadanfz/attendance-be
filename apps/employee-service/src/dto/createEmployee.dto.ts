import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator"
import { EmployeeStatus } from "../employees/entities/employee.entity.js"
import { Expose } from "class-transformer"

export class CreateEmployeeDTO {
    @IsNotEmpty()
    @MinLength(7)
    @MaxLength(50)
    password: string

    @Expose({name: "full_name"})
    @IsNotEmpty({message: "full_name should not be empty"})
    @MaxLength(100, {message: "full_name must be shorter than or equal to 100 characters"})
    fullName: string

    @IsNotEmpty()
    @IsEmail()
    @MaxLength(70)
    email: string

    @Expose({name: "phone_number"})
    @IsOptional()
    @MaxLength(20)
    phoneNumber?: string

    @IsNotEmpty()
    position: string

    @IsNotEmpty()
    department: string

    @IsNotEmpty()
    @IsIn([EmployeeStatus.ACTIVE, EmployeeStatus.INACTIVE])
    status: EmployeeStatus
}
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Max, MaxLength } from "class-validator"
import { UserRole } from "../entities/account.entity.js"

export class CreateAccountDTO {
    @IsNumber()
    @IsNotEmpty()
    employeeId: number

    @IsString()
    @IsNotEmpty()
    @MaxLength(70)
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    password: string

    @IsEnum(UserRole)
    role: UserRole
}
import { Expose } from 'class-transformer';
import { IsEmail, IsIn, IsOptional, MaxLength } from 'class-validator';
import { EmployeeStatus } from '../employees/entities/employee.entity.js';

export class UpdateEmployeeDTO {
  @Expose({ name: 'full_name' })
  @IsOptional()
  @MaxLength(100, {
    message: 'full_name must be shorter than or equal to 100 characters',
  })
  fullName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @Expose({ name: 'phone_number' })
  @IsOptional()
  @MaxLength(20)
  phoneNumber: string;

  @IsOptional()
  position: string;

  @IsOptional()
  department: string;

  @IsOptional()
  @IsIn([EmployeeStatus.ACTIVE, EmployeeStatus.INACTIVE])
  status: EmployeeStatus;
}

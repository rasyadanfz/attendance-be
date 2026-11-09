import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateAccountDTO {
  @IsOptional()
  @IsEmail()
  email: string;

  @Expose({ name: 'is_active' })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}

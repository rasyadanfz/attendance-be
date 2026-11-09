import { IsEmail, IsNotEmpty, IsString, Max, MaxLength } from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(70)
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  password: string;
}

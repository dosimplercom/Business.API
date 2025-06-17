import { IsEmail, IsString, IsNotEmpty, MinLength, IsNumber, IsOptional } from 'class-validator';

export class RegisterOwnerStaffDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterBusinessStaffDto extends RegisterOwnerStaffDto {
  @IsNumber()
  role_id: number;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class VerifyEmailCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  newPassword: string;

  @IsString()
  confirmPassword: string;
}

export class UpdateStaffDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsNumber()
  role_id?: number;
}

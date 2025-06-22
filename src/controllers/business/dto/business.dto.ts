import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
  MaxLength,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';

export class BusinessDto {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsBoolean()
  phone_verified: boolean;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  sys_industry_id: number;

  @IsInt()
  sys_time_zone_id: number;

  @IsInt()
  currency_id: number;

  @IsNotEmpty()
  created_at: Date;

  @IsOptional()
  updated_at?: Date | null;
}

export class BusinessCreateDto {
  @IsInt()
  entity_id: number;

  @IsString()
  phone: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  subdomain: string;

  @IsInt()
  sys_industry_id: number;

  @IsInt()
  sys_time_zone_id: number;

  @IsInt()
  currency_id: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  supported_languages: number[];

  @IsBoolean()
  appointment_requires_approval: boolean;
}

export class BusinessResponseDto {
  @IsInt()
  id: number;

  @IsString()
  phone: string;

  @IsBoolean()
  phone_verified: boolean;

  @IsString()
  name: string;

  @IsInt()
  sys_industry_id: number;

  @IsInt()
  sys_time_zone_id: number;

  @IsInt()
  currency_id: number;
}

export class SupportedLanguagesPayloadDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  supported_languages: number[];
}
export class AppointmentApprovalPayloadDto {
  @IsBoolean()
  requires: boolean;
}

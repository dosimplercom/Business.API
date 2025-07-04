import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Service } from 'src/entities/service.entity';
import { Transform } from 'class-transformer';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  default_duration_in_minutes: number;

  @IsInt()
  @Min(0)
  default_buffer_time_in_minutes: number;

  @IsNumber()
  default_cost: number;

  @IsBoolean()
  available_for_online_booking: boolean;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

export class ServiceDto extends Service {
  @Transform(({ value }) => (!!value ? parseFloat(value) : 0), {
    toClassOnly: true,
  })
  default_cost: number;
}

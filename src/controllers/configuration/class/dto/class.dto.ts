import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class ClassManipulationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  default_duration_in_minutes: number;

  @IsInt()
  @Min(0)
  default_buffer_time_in_minutes: number;

  @IsNotEmpty()
  @IsPositive()
  default_cost: number;

  @IsBoolean()
  available_for_online_booking: boolean;

  @IsInt()
  @Min(0)
  capacity: number;
}

export class ClassCreationDto extends ClassManipulationDto {
  @IsInt()
  business_id: number;
}

export class ClassUpdateDto extends ClassManipulationDto {}

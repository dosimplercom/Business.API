import { Transform } from 'class-transformer';
import { ClassEntity } from 'src/entities/class.entity';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class ClassManipulationPayloadDto {
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

export class ClassDto extends ClassEntity {
  @Transform(({ value }) => (!!value ? parseFloat(value) : 0), {
    toClassOnly: true,
  })
  default_cost: number;
}

// export class ClassDto {
//   id: number;

//   business_id: number;

//   name: string;

//   description?: string;

//   default_duration_in_minutes: number;

//   default_buffer_time_in_minutes: number;

//   @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
//   default_cost: number;

//   capacity: number;

//   available_for_online_booking: boolean;

//   created_at: Date;

//   updated_at: Date | null;

//   deleted: boolean;
// }

import {
  IsNumber,
  IsArray,
  IsString,
  IsOptional,
  Min,
  IsPositive,
} from 'class-validator';

export abstract class BookedClassBaseDto {
  @IsNumber()
  class_id: number;

  @IsNumber()
  staff_id: number;

  @IsArray()
  @IsNumber({}, { each: true })
  customer_ids: number[];

  @IsOptional()
  @IsString()
  comment?: string;

  @IsNumber()
  @Min(0)
  duration_in_minutes: number;

  @IsNumber()
  @Min(0)
  buffer_time_in_minutes: number;

  @IsNumber()
  @Min(0)
  cost: number;

  @IsNumber()
  @IsPositive()
  capacity: number;
}
export abstract class BookedClassManipulationDto extends BookedClassBaseDto {
  @IsNumber()
  business_id: number;

  @IsNumber()
  caller_staff_id: number;

  @IsString()
  date: string;

  @IsString()
  start_time: string;
}

export class BookedClassPayloadDto extends BookedClassBaseDto {
  @IsNumber()
  date_mls: number;
}
export class BookedClassCreateDto extends BookedClassManipulationDto {
  @IsOptional()
  @IsNumber()
  status_id: number | null;
}
export class BookedClassUpdateDto extends BookedClassManipulationDto {}

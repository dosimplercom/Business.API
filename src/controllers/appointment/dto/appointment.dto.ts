// src/appointments/dto/appointment.dto.ts

import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class AppointmentCreatePayloadDto {
  @IsNumber()
  staff_id: number;

  @IsNumber()
  customer_id: number;

  @IsNumber()
  service_id: number;

  @IsNumber()
  cost: number;

  @IsNumber()
  date_mls: number;

  @IsNumber()
  duration_in_minutes: number;

  @IsNumber()
  buffer_time_in_minutes: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class AppointmentCreateDto extends AppointmentCreatePayloadDto {
  @IsNumber()
  business_id: number;

  @IsString()
  date: string;

  @IsString()
  start_time: string;
}

export class AppointmentUpdatePayloadDto {
  @IsNumber()
  staff_id: number;

  @IsNumber()
  customer_id: number;

  @IsNumber()
  service_id: number;

  @IsNumber()
  cost: number;

  @IsNumber()
  date_mls: number;

  @IsNumber()
  duration_in_minutes: number;

  @IsNumber()
  buffer_time_in_minutes: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class AppointmentUpdateDto extends AppointmentUpdatePayloadDto {
  /*
  business_id is for validation purposes only, it doesn't update the appointment's business_id.
  */
  @IsNumber()
  business_id: number;

  @IsString()
  date: string;

  @IsString()
  start_time: string;
}

export class ReschedulePayloadDto {
  @IsNumber()
  staff_id: number;

  @IsNumber()
  date_mls: number;

  @IsNumber()
  duration_in_minutes: number;

  @IsNumber()
  buffer_time_in_minutes: number;
}

export class RescheduleRequestDto extends ReschedulePayloadDto {
  /*
  business_id is for validation purposes only, it doesn't update the appointment's business_id.
  */
  @IsNumber()
  business_id: number;

  @IsString()
  date: string;

  @IsString()
  start_time: string;
}

export class PendingAppointmentListPayloadDto {
  @IsNumber()
  @IsOptional()
  staff_id?: number;
}

export class ChangeEventStatusDto {
  @IsNumber()
  event_id: number;

  @IsNumber()
  status_id: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

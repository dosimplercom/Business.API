import { IsDateString, IsInt } from 'class-validator';

export class GetSchedulerEventsDto {
  @IsInt()
  staff_id: number;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;
}

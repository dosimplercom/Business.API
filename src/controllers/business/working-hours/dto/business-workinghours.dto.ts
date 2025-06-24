import { IsInt, IsNotEmpty, Matches } from 'class-validator';

export class BusinessWorkingHoursPayloadDTO {
  @IsInt()
  @IsNotEmpty()
  sys_day_id: number;

  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'from_date must be a valid time string (HH:mm:ss)',
  })
  from_date: string;

  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'to_date must be a valid time string (HH:mm:ss)',
  })
  to_date: string;
}

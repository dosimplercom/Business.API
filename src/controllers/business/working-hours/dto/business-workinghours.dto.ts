import { IsInt, IsNotEmpty, Matches } from 'class-validator';

export class BusinessWorkingHoursPayloadDTO {
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'from_date must be a valid time string (HH:mm)',
  })
  from_date: string;

  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'to_date must be a valid time string (HH:mm)',
  })
  to_date: string;
}

export class BusinessWorkingHoursCreationPayloadDTO extends BusinessWorkingHoursPayloadDTO {
  @IsInt()
  @IsNotEmpty()
  sys_day_id: number;
}

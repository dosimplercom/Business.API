import { IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CalendarColorDto {
  @IsInt()
  sys_color_type_id: number;

  @IsInt()
  color: number;
}

export class CalendarColorArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CalendarColorDto)
  colors: CalendarColorDto[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Business } from './business.entity';
import { SysColorTypes } from './sys-color-types.entity';

@Entity({ name: 'business_calendar_colors' })
export class BusinessCalendarColors {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'integer' })
  business_id: number;

  @Column({ type: 'integer' })
  sys_color_type_id: number;

  @Column({ type: 'bigint' })
  color: string;

  @ManyToOne(() => Business)
  @JoinColumn({ name: 'business_id', foreignKeyConstraintName: 'business_calendar_colors_business_id_fkey' })
  business: Business;

  @ManyToOne(() => SysColorTypes)
  @JoinColumn({ name: 'sys_color_type_id', foreignKeyConstraintName: 'business_calendar_colors_sys_color_type_id_fkey' })
  colorType: SysColorTypes;
}

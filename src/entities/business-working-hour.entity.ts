import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Business } from './business.entity';
import { SysDay } from './sys-day.entity';

@Entity({ name: 'business_working_hour' })
export class BusinessWorkingHour {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'integer' })
  business_id: number;

  @Column({ type: 'integer' })
  sys_day_id: number;

  @Column({ type: 'time', nullable: true })
  from_date: string | null;

  @Column({ type: 'time', nullable: true })
  to_date: string | null;

  @Column({ type: 'boolean', default: false })
  is_date_specific: boolean;

  @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
  updated_at: Date | null;

  @ManyToOne(() => Business)
  @JoinColumn({ name: 'business_id', foreignKeyConstraintName: 'business_working_hour_business_id_fkey' })
  business: Business;

  @ManyToOne(() => SysDay)
  @JoinColumn({ name: 'sys_day_id', foreignKeyConstraintName: 'business_working_hour_sys_day_id_fkey' })
  sysDay: SysDay;
}

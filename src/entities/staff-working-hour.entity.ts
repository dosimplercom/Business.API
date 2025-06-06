import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityModel } from './entity.entity';
import { SysDay } from './sys-day.entity';

@Entity({ name: 'staff_working_hour' })
export class StaffWorkingHour {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column()
  entity_id: number;

  @Column()
  sys_day_id: number;

  @Column({ type: 'time', nullable: true })
  from_date: string | null;

  @Column({ type: 'time', nullable: true })
  to_date: string | null;

  @Column({ default: false })
  is_date_specific: boolean;

  @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
  updated_at: Date | null;

  @ManyToOne(() => EntityModel, (entity) => entity.id, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'entity_id', foreignKeyConstraintName: 'fk_staff_working_hours_entity' })
  entity: EntityModel;

  @ManyToOne(() => SysDay, (sysDay) => sysDay.id, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'sys_day_id', foreignKeyConstraintName: 'fk_staff_working_hours_sys_day' })
  sys_day: SysDay;
}

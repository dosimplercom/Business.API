import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Staff } from './staff.entity';
import { Customer } from './customer.entity';
import { ClassEntity } from './class.entity';
import { SysAppointmentStatus } from './sys-appointment-status.entity';

@Entity({ name: 'booked_class' })
export class BookedClass {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column()
  staff_id: number;

  @Column({ nullable: true })
  customer_id?: number;

  @Column()
  class_id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'char', length: 8, nullable: true })
  booking_number?: string;

  @Column({ default: false })
  deleted: boolean;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  cost: string;

  @Column({ type: 'int', default: 0 })
  duration_in_minutes: number;

  @Column({ type: 'int', default: 0 })
  buffer_time_in_minutes: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 1 })
  capacity: string;

  @Column()
  status_id: number;

  @Column({ type: 'text', nullable: true })
  cancel_comment?: string;

  @ManyToOne(() => Staff, (staff) => staff.entity_id, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'staff_id', foreignKeyConstraintName: 'booked_class_staff_id_fkey' })
  staff: Staff;

  @ManyToOne(() => Customer, (customer) => customer.entity_id, { nullable: true, onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'customer_id', foreignKeyConstraintName: 'booked_class_customer_id_fkey' })
  customer?: Customer;

  @ManyToOne(() => ClassEntity, (cls) => cls.id, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'class_id', foreignKeyConstraintName: 'booked_class_class_id_fkey' })
  class: ClassEntity;

  @ManyToOne(() => SysAppointmentStatus, (status) => status.id, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'status_id', foreignKeyConstraintName: 'booked_class_status_id_fkey' })
  status: SysAppointmentStatus;
}

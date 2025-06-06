import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  AfterInsert,
} from 'typeorm';
import { Staff } from './staff.entity';
import { Customer } from './customer.entity';
import { Service } from './service.entity';
import { SysAppointmentStatus } from './sys-appointment-status.entity';

@Entity({ name: 'appointment' })
@Index('idx_unique_booking_number', ['booking_number'], { unique: true })
export class Appointment {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column()
  staff_id: number;

  @Column()
  customer_id: number;

  @Column()
  service_id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time without time zone' })
  start_time: string;

  @Column({ type: 'time without time zone' })
  end_time: string;

  @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
  updated_at: Date | null;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'char', length: 8, nullable: true, unique: true })
  booking_number?: string;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  cost: number;

  @Column({ type: 'integer', default: 0 })
  duration_in_minutes: number;

  @Column({ type: 'integer', default: 0 })
  buffer_time_in_minutes: number;

  @Column({ type: 'text', nullable: true })
  cancel_comment?: string;

  @Column()
  status_id: number;

  @ManyToOne(() => Staff, (staff) => staff.entity_id, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'staff_id', foreignKeyConstraintName: 'appointment_staff_id_fkey' })
  staff: Staff;

  @ManyToOne(() => Customer, (customer) => customer.entity_id, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'customer_id', foreignKeyConstraintName: 'appointment_customer_id_fkey' })
  customer: Customer;

  @ManyToOne(() => Service, (service) => service.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'service_id', foreignKeyConstraintName: 'appointment_service_id_fkey' })
  service: Service;

  @ManyToOne(() => SysAppointmentStatus, (status) => status.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'status_id', foreignKeyConstraintName: 'appointment_status_id_fkey' })
  status: SysAppointmentStatus;

    @AfterInsert()
    logInsert() {
      console.log('Inserted User with id', this.id);
      this.booking_number = generateBookingNumber(this.id);
    }
}


import crypto from 'crypto';

export function generateBookingNumber(id: number): string {
  // Hash the id as a string with SHA-256
  const hash = crypto.createHash('sha256').update(id.toString()).digest('hex');
  // Take first 8 characters and uppercase
  return hash.substring(0, 8).toUpperCase();
}
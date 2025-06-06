import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'sys_appointment_status' })
export class SysAppointmentStatus {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'integer' })
  sort: number;

  @Column({ type: 'boolean', nullable: true })
  is_active: boolean | null;
}

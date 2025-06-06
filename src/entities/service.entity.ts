import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Business } from './business.entity';

@Entity({ name: 'service' })
export class Service {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column()
  business_id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int', default: 0 })
  default_duration_in_minutes: number;

  @Column({ type: 'int', default: 0 })
  default_buffer_time_in_minutes: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  default_cost: number;

  @Column({ type: 'boolean', default: false })
  available_for_online_booking: boolean;

  @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
  updated_at: Date | null;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @ManyToOne(() => Business, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'business_id', foreignKeyConstraintName: 'service_business_id_fkey' })
  business: Business;
}

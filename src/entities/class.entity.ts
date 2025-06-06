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

@Entity({ name: 'class' })
export class ClassEntity {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column()
  business_id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', default: 0 })
  default_duration_in_minutes: number;

  @Column({ type: 'int', default: 0 })
  default_buffer_time_in_minutes: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  default_cost: number; // numeric mapped to string for precision

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 1 })
  capacity: number;

  @Column({ default: false })
  available_for_online_booking: boolean;

  @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
  updated_at: Date | null;

  @Column({ default: false })
  deleted: boolean;

  @ManyToOne(() => Business, (business) => business.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'business_id', foreignKeyConstraintName: 'class_business_id_fkey' })
  business: Business;
}

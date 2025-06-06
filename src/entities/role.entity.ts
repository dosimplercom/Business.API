import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Business } from './business.entity';

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: false })
  system_role: boolean;

  @Column({ type: 'integer', nullable: true })
  business_id: number | null;

  @Column({ type: 'boolean', default: false })
  owner_role: boolean;

  @ManyToOne(() => Business, { nullable: true, onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'business_id', foreignKeyConstraintName: 'role_business_id_fkey' })
  business: Business | null;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from 'typeorm';
import { Business } from './business.entity';
import { SysEntityType } from './sys-entity-type.entity';

@Entity({ name: 'entity' })
@Index('idx_entity_full_name', ['full_name'])
export class EntityModel {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'integer', nullable: true })
  business_id: number | null;

  @Column({ type: 'integer' })
  sys_entity_type_id: number;

  @Column({ type: 'varchar', length: 100 })
  first_name: string;

  @Column({ type: 'varchar', length: 100 })
  last_name: string;

  @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
  updated_at: Date | null;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @Column({ type: 'text', generatedType: 'STORED', asExpression: `TRIM(BOTH FROM ((first_name || ' ') || last_name))` })
  full_name: string;

  @ManyToOne(() => Business)
  @JoinColumn({ name: 'business_id', foreignKeyConstraintName: 'entity_business_id_fkey' })
  business: Business;

  @ManyToOne(() => SysEntityType, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'sys_entity_type_id', foreignKeyConstraintName: 'entity_sys_entity_type_id_fkey' })
  entityType: SysEntityType;
}

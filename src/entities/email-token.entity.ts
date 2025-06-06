import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn
} from 'typeorm';
import { EntityModel } from './entity.entity';

@Entity({ name: 'email_token' })
export class EmailToken {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'integer' })
  entity_id: number;

  @Column({ type: 'varchar', length: 6 })
  token: string;

  @Column({ type: 'timestamp without time zone' })
  expires_at: Date;

  @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date; 

  @Column({ type: 'boolean', default: false })
  used: boolean;

  @ManyToOne(() => EntityModel, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'entity_id', foreignKeyConstraintName: 'email_token_entity_id_fkey' })
  entity: EntityModel;
}

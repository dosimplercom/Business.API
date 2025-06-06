import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { EntityModel } from './entity.entity';

@Entity({ name: 'customer' })
export class Customer {
  @PrimaryColumn({ type: 'integer' })
  entity_id: number;

  @Column({ type: 'boolean', default: false })
  is_guest: boolean;

  @OneToOne(() => EntityModel, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'entity_id', foreignKeyConstraintName: 'customer_entity_id_fkey' })
  entity: EntityModel;
}

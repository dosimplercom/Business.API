import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { EntityModel } from './entity.entity';

@Entity({ name: 'staff' })
export class Staff {
  @PrimaryColumn({ type: 'integer' })
  entity_id: number;

  @Column({ type: 'text', nullable: true })
  url: string | null;

  @OneToOne(() => EntityModel, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'entity_id', foreignKeyConstraintName: 'staff_entity_id_fk' })
  entity: EntityModel;
}

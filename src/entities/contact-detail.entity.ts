import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EntityModel } from './entity.entity';
import { SysContactDetailType } from './sys-contact-detail-type.entity';

@Entity({ name: 'contact_detail' })
export class ContactDetail {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column()
  entity_id: number;

  @Column({ default: false })
  is_primary: boolean;

  @Column()
  sys_contact_detail_type_id: number;

  @Column({ type: 'jsonb', nullable: true })
  detail_value: any;

  @ManyToOne(() => EntityModel, (entity) => entity.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'entity_id', foreignKeyConstraintName: 'contact_detail_entity_id_fkey' })
  entity: EntityModel;

  @ManyToOne(() => SysContactDetailType, (type) => type.id, {
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'sys_contact_detail_type_id', foreignKeyConstraintName: 'contact_detail_sys_contact_detail_type_id_fkey' })
  contact_detail_type: SysContactDetailType;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { EntityModel } from './entity.entity';
import { Service } from './service.entity';

@Entity({ name: 'staff_service' })
@Unique(['entity_id', 'service_id'])
export class StaffService {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column()
  entity_id: number;

  @Column()
  service_id: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => EntityModel, (entity) => entity.id, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'entity_id', foreignKeyConstraintName: 'staff_service_entity_id_fkey' })
  entity: EntityModel;

  @ManyToOne(() => Service, (service) => service.id, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'service_id', foreignKeyConstraintName: 'staff_service_service_id_fkey' })
  service: Service;
}

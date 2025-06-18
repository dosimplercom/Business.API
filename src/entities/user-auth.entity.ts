import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EntityModel } from './entity.entity';
import { Role } from './role.entity';

@Entity('user_auth')
@Unique('user_auth_email_business_id_unique', ['email', 'business_id'])
export class UserAuth {
  @PrimaryColumn({ type: 'int' })
  entity_id: number;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'int', nullable: true })
  role_id: number | null;

  @Column({ type: 'boolean', default: false, nullable: false })
  email_verified: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  phone_verified: boolean;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
  updated_at: Date | null;

  @Column({ type: 'int', nullable: true })
  business_id: number | null;

  @ManyToOne(() => EntityModel, {
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
  })
  @JoinColumn({
    name: 'entity_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'user_auth_entity_id_fkey',
  })
  entity: EntityModel;

  @ManyToOne(() => Role, {
    nullable: true,
    onUpdate: 'NO ACTION',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'user_auth_role_id_fkey',
  })
  role: Role;
}

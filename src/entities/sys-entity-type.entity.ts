import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({ name: 'sys_entity_type' })
@Unique(['type_name'])
export class SysEntityType {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  type_name: string;
}

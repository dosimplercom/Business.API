import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({ name: 'sys_contact_detail_type' })
@Unique(['type_name'])
export class SysContactDetailType {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  type_name: string;
}

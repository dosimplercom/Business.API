import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'sys_industry' })
export class SysIndustry {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'integer' })
  sort: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
    
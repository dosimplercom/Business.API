import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'sys_day' })
export class SysDay {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'integer' })
  sort: number;

  @Column({ type: 'boolean', nullable: true })
  is_active: boolean | null;
}

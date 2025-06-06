import { Entity, Column, Unique, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sys_language' })
@Unique(['code'])
export class SysLanguage {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'char', length: 2 })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'integer', default: 0 })
  sort: number;
}

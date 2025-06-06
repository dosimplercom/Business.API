import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'sys_color_types' })
export class SysColorTypes {
  @PrimaryGeneratedColumn('increment', { type: 'integer', primaryKeyConstraintName: 'sys_color_types_pkey' })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string | null;
}

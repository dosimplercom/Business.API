import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { SysDataType } from './sys-data-type.entity';
import { SysLanguage } from './sys-language.entity';

@Entity({ name: 'sys_data_by_language' })
@Unique(['data_type_id', 'language_id', 'sys_data_id'])
export class SysDataByLanguage {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'integer' })
  data_type_id: number;

  @Column({ type: 'integer' })
  language_id: number;

  @Column({ type: 'integer' })
  sys_data_id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToOne(() => SysDataType, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'data_type_id', foreignKeyConstraintName: 'sys_data_type_data_type_id_fk' })
  data_type: SysDataType;

  @ManyToOne(() => SysLanguage, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'language_id', foreignKeyConstraintName: 'sys_data_by_language_language_id_fkey' })
  language: SysLanguage;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SysCountry } from './sys-country.entity';

@Entity({ name: 'sys_state' })
export class SysState {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'integer' })
  country_id: number;

  @ManyToOne(() => SysCountry, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'country_id', foreignKeyConstraintName: 'state_country_id_fkey' })
  country: SysCountry;
}

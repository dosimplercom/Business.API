import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'system_settings' })
export class SystemSettings {
  @PrimaryColumn({ type: 'text' })
  key: string;

  @Column({ type: 'jsonb' })
  value: any;
}

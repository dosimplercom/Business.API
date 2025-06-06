import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Staff } from './staff.entity';

@Entity({ name: 'staff_preference' })
export class StaffPreference {
  @PrimaryColumn()
  staff_id: number;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  preferences: object;

  @OneToOne(() => Staff, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'staff_id', foreignKeyConstraintName: 'staff_preference_staff_id_fkey' })
  staff: Staff;
}

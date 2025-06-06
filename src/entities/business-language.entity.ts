import { Entity, Column, ManyToOne, JoinColumn, Unique, RelationId, PrimaryGeneratedColumn } from 'typeorm';
import { Business } from './business.entity';
import { SysLanguage } from './sys-language.entity';

@Entity('business_language')
@Unique('business_language_unique_key', ['business', 'language'])
export class BusinessLanguage {

  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @RelationId((bl: BusinessLanguage) => bl.business)
  business_id: number;

  @ManyToOne(() => SysLanguage, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_id' })
  language: SysLanguage;

  @RelationId((bl: BusinessLanguage) => bl.language)
  language_id: number;

  @Column({ type: 'boolean', nullable: true })
  active: boolean;

  @Column({ type: 'numeric' })
  sort: number;
}

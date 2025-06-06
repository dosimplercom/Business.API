import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BookedClass } from './booked-class.entity';
import { Customer } from './customer.entity';

@Entity({ name: 'booked_class_customer' })
export class BookedClassCustomer {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column()
  booked_class_id: number;

  @Column()
  customer_id: number;

  @ManyToOne(() => BookedClass, (bookedClass) => bookedClass.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'booked_class_id', foreignKeyConstraintName: 'booked_class_customer_booked_class_id_fkey' })
  bookedClass: BookedClass;

  @ManyToOne(() => Customer, (customer) => customer.entity_id, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'customer_id', foreignKeyConstraintName: 'booked_class_customer_customer_id_fkey' })
  customer: Customer;
}

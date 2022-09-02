import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

import { AmountUsage } from './AmountUsage';
import { BaseEntity } from '../infrastructure/databases/common/BaseEntity';

@Entity('amount')
export class Amount extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'float', nullable: true })
  amount: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  type: 'PAYMENT' | 'BALANCE';

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'bigint', nullable: true })
  userId: number;

  @Column({ type: 'bigint', nullable: true })
  organizationId: number;

  @Column({ type: 'bigint', nullable: true })
  userCreatedId: number;

  @OneToOne(() => AmountUsage, (amountUsage) => amountUsage.amount, {
    onDelete: 'CASCADE',
  })
  amountUsage?: AmountUsage;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { BaseEntity } from '../infrastructure/databases/common/BaseEntity';
import { Organization } from './Organization';

@Entity('amount_balance')
export class AmountBalance extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'float', nullable: true })
  amountBalance?: number;

  @Column({ type: 'bigint', nullable: true })
  amountId?: number;

  @Column({ type: 'bigint', nullable: true })
  userId?: number;

  @Column({ type: 'bigint', nullable: true })
  organizationId?: number;

  @Column({ type: 'timestamptz', nullable: true })
  monthAmountBalanceAt?: Date;

  @ManyToOne(() => Organization, (organization) => organization.amountBalances)
  @JoinColumn()
  organization?: Organization;
}

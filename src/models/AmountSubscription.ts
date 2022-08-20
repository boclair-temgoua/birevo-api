import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { BaseEntity } from '../infrastructure/databases/common/BaseEntity';
import { User } from './User';
import { Amount } from './Amount';
import { Organization } from './Organization';

@Entity('amount_subscription')
export class AmountSubscription extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'float', nullable: true })
  amountSubscription: number;

  @Column({ type: 'bigint', nullable: true })
  amountId: number;

  @Column({ type: 'bigint', nullable: true })
  userId: number;

  @Column({ type: 'bigint', nullable: true })
  organizationId: number;

  @OneToOne(() => Amount, (amount) => amount.amountSubscription, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  amount?: Amount;

  @ManyToOne(
    () => Organization,
    (organization) => organization.amountSubscriptions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  organization?: Organization;
}

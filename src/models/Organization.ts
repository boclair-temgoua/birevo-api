import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { User } from './User';
import { BaseDeleteEntity } from '../infrastructure/databases/common/BaseDeleteEntity';
import { Color } from '../infrastructure/utils/commons/get-colors';
import { Subscribe } from './Subscribe';

@Entity('organization')
export class Organization extends BaseDeleteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'uuid', unique: true })
  uuid!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  color?: Color;

  @Column({ type: 'bigint', nullable: true })
  userId?: number;

  @OneToMany(() => Subscribe, (subscribe) => subscribe.organization, {
    onDelete: 'CASCADE',
  })
  subscribes?: Subscribe[];

  // @OneToMany(() => AmountSubscription, (amountSubscription) => amountSubscription.organization, {
  //     onDelete: 'CASCADE',
  // })
  // amountSubscriptions?: AmountSubscription[];

  @ManyToOne(() => User, (user) => user.organizations, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @OneToMany(() => User, (user) => user.organizationInUtilization, {
    onDelete: 'CASCADE',
  })
  users?: User[];
}

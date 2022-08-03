import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { User } from './User';
import { BaseDeleteEntity } from '../infrastructure/databases/common/BaseDeleteEntity';
import { Color } from '../infrastructure/utils/commons/get-colors';
@Entity('profile')
export class Profile extends BaseDeleteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ type: 'bigint', nullable: true })
  currencyId?: number;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  color?: Color;

  @Column({ nullable: true })
  lastName?: string;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  user?: User;
}

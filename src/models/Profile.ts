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

@Entity('profile')
export class Profile extends BaseDeleteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({
    type: 'uuid',
    unique: true,
  })
  uuid?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ type: 'bigint', nullable: true })
  currencyId?: number;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  lastName?: string;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  user?: User;
}

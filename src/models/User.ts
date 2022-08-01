import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { BaseDeleteEntity } from '../infrastructure/databases/common/BaseDeleteEntity';
import { Profile } from './Profile';

@Entity('user')
export class User extends BaseDeleteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({
    type: 'uuid',
    unique: true,
    nullable: true,
  })
  uuid?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  noHashPassword?: string;

  @Column({ type: 'bigint', nullable: true })
  profileId?: number;

  @Column({ type: 'bigint', nullable: true })
  organizationInUtilizationId?: number;

  @OneToOne(() => Profile, (profile) => profile.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  profile?: Profile;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { ApplicationToken } from './ApplicationToken';

import { User } from './User';
import { BaseDeleteEntity } from '../infrastructure/databases/common/BaseDeleteEntity';
import { Color } from '../infrastructure/utils/commons';
import { StatusOnline } from '../modules/application/dto/validation-application.dto';

@Entity('application')
export class Application extends BaseDeleteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({
    type: 'uuid',
    unique: true,
  })
  uuid?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  color?: Color;

  @Column({ default: 'ONLINE', length: 30 })
  statusOnline?: StatusOnline;

  @Column({ type: 'bigint', nullable: true })
  userId?: number;

  @Column({ type: 'bigint', nullable: true })
  userCreatedId?: number;

  @ManyToOne(() => User, (user) => user.applicationTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: User;

  @OneToMany(
    () => ApplicationToken,
    (applicationToken) => applicationToken.application,
    {
      onDelete: 'CASCADE',
    },
  )
  applicationTokens?: ApplicationToken[];
}

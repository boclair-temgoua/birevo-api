import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { BaseDeleteEntity } from '../infrastructure/databases/common/BaseDeleteEntity';
import { Application } from './Application';

import { User } from './User';

@Entity('application_token')
export class ApplicationToken extends BaseDeleteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({
    type: 'uuid',
    unique: true,
  })
  uuid?: string;

  @Column({ type: 'bigint', nullable: true })
  userId?: number;

  @Column({ type: 'bigint', nullable: true })
  userCreatedId?: number;

  @Column({ type: 'bigint', nullable: true })
  applicationId?: number;

  @Column({ type: 'bigint', nullable: true })
  organizationId?: number;

  @Column({ nullable: true })
  token?: string;

  @ManyToOne(() => User, (user) => user.applicationTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: User;

  @ManyToOne(
    () => Application,
    (application) => application.applicationTokens,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  application?: Application;
}

import * as bcrypt from 'bcryptjs';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { BaseDeleteEntity } from '../infrastructure/databases/common/BaseDeleteEntity';
import { Profile } from './Profile';
import { Organization } from './Organization';
import { ApplicationToken } from './ApplicationToken';
import { Voucher } from './Voucher';
import { Subscribe } from './Subscribe';

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

  @Column({ default: false })
  requiresPayment?: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  confirmedAt?: Date;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column('simple-array', { nullable: true })
  accessToken?: string[];

  @Column('simple-array', { nullable: true })
  refreshToken?: string[];

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  token?: string;

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

  @OneToMany(() => Voucher, (voucher) => voucher.user, { onDelete: 'CASCADE' })
  vouchers?: Voucher[];

  @OneToMany(() => Subscribe, (subscribe) => subscribe.userCreated, {
    onDelete: 'CASCADE',
  })
  subscribes?: Subscribe[];

  @OneToMany(() => Organization, (organization) => organization.user, {
    onDelete: 'CASCADE',
  })
  organizations?: Organization[];

  @ManyToOne(() => Organization, (organization) => organization.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    { name: 'organizationInUtilizationId', referencedColumnName: 'id' },
  ])
  organizationInUtilization?: Organization;

  @OneToMany(
    () => ApplicationToken,
    (applicationToken) => applicationToken.user,
    { onDelete: 'CASCADE' },
  )
  applicationTokens?: ApplicationToken[];

  async hashPassword(password: string) {
    this.password = await bcrypt.hashSync(password || this.password, 8);
  }

  checkIfPasswordMatch(password: string) {
    return bcrypt.compareSync(password, String(this.password));
  }
}

import * as bcrypt from 'bcryptjs';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';

import { BaseDeleteEntity } from '../infrastructure/databases/common/BaseDeleteEntity';
import { Profile } from './Profile';
import { Organization } from './Organization';

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

  @Column('simple-array', { nullable: true })
  accessToken?: string[];

  @Column('simple-array', { nullable: true })
  refreshToken?: string[];

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

  @BeforeInsert()
  async setPassword(password: string) {
    this.password = await bcrypt.hashSync(password || this.password, 8);
  }

  checkIfPasswordMatch(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, String(this.password));
  }
}

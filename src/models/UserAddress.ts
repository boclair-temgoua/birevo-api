import { Organization } from './Organization';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { BaseDeleteEntity } from '../infrastructure/databases/common/BaseDeleteEntity';

@Entity('user_address')
export class UserAddress extends BaseDeleteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'uuid', unique: true })
  uuid!: string;

  @Column({ nullable: true })
  company?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  region?: string;

  @Column({ nullable: true })
  street1?: string;

  @Column({ nullable: true })
  street2?: string;

  @Column({ nullable: true })
  cap?: string;

  @Column({ type: 'bigint', nullable: true })
  countryId?: number;

  @Column({ type: 'bigint', nullable: true })
  userId?: number;

  @Column({ type: 'bigint', nullable: true })
  organizationId?: number;

  @ManyToOne(() => Organization, (organization) => organization.userAddress, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;
}

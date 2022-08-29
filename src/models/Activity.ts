import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Nullable } from '../infrastructure/utils/use-catch';
import { BaseEntity } from '../infrastructure/databases/common/BaseEntity';

@Entity('activity')
export class Activity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'uuid', unique: true })
  uuid!: string;

  @Column({ nullable: true })
  activityAbleType?: string;

  @Column({ type: 'bigint', nullable: true })
  activityAbleId?: number;

  @Column({ length: 30, nullable: true })
  action?: string;

  @Column({ nullable: true })
  ipLocation?: string;

  @Column({ nullable: true })
  browser?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  platform?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  countryCode?: string;

  @Column({ type: 'bigint', nullable: true })
  organizationId?: number;

  @Column({ type: 'bigint', nullable: true })
  applicationId?: number;

  @Column({ type: 'bigint', nullable: true })
  userCreatedId: number;

  @Column({ type: 'bigint', nullable: true })
  usage?: number;

  @Column({ type: 'bigint', nullable: true })
  view?: number;
}

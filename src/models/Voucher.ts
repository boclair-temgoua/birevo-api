import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Currency } from './Currency';
import { User } from './User';
import { BaseDeleteEntity } from '../infrastructure/databases/common/BaseDeleteEntity';
import {
  StatusOnline,
  StatusVoucher,
  VoucherableType,
} from '../modules/voucher/dto/validation-voucher.dto';

@Entity('voucher')
export class Voucher extends BaseDeleteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ type: 'timestamptz', nullable: true })
  usedAt?: Date;

  @Column({ type: 'uuid', unique: true })
  uuid?: string;

  @Column()
  code?: string;

  @Column({ type: 'bigint', nullable: true })
  voucherCategoryId?: number;

  @Column({ nullable: true })
  currencyId?: number;

  @Column({ default: 'COUPON', length: 30 })
  voucherType?: VoucherableType;

  @Column({ default: 'ONLINE', length: 30 })
  statusOnline?: StatusOnline;

  @Column({ default: 'PENDING', length: 30 })
  status?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'float', nullable: true })
  amount?: number;

  @Column({ type: 'float', nullable: true })
  percent?: number;

  @Column({ nullable: true, type: 'timestamptz' })
  startedAt?: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  expiredAt?: Date;

  @Column({ type: 'bigint', nullable: true })
  userTransactionId?: number;

  @Column({ type: 'bigint', nullable: true })
  userId?: number;

  @Column({ type: 'bigint', nullable: true })
  organizationId?: number;

  @Column({ type: 'bigint', nullable: true })
  userCreatedId?: number;

  @Column({ type: 'bigint', nullable: true })
  applicationId?: number;

  @ManyToOne(() => User, (user) => user.vouchers, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @ManyToOne(() => Currency, (currency) => currency.vouchers)
  @JoinColumn()
  currency?: Currency;
}

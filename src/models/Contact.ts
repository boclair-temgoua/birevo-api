import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { BaseDeleteEntity } from '../infrastructure/databases/common/BaseDeleteEntity';

@Entity('contact')
export class Contact extends BaseDeleteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({
    type: 'uuid',
    unique: true,
    nullable: true,
  })
  uuid?: string;

  @Column({ default: false })
  isRed?: boolean;

  @Column({ nullable: true })
  slug?: string;

  @Column({ nullable: true })
  fistName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  subject?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'bigint', nullable: true })
  userId?: number;
}

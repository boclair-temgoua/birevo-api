import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { BaseDeleteEntity } from '../infrastructure/databases/common/BaseDeleteEntity';
import { TypeFaq } from '../modules/faq/dto/validation-faq.dto';

@Entity('faq')
export class Faq extends BaseDeleteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({
    type: 'uuid',
    unique: true,
    nullable: true,
  })
  uuid?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ default: true })
  status?: boolean;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  type?: TypeFaq;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'bigint', nullable: true })
  userCreatedId?: number;

  @Column({ type: 'bigint', nullable: true })
  userId?: number;
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { BaseDeleteEntity } from '../infrastructure/databases/common/BaseDeleteEntity';

@Entity('testimonial')
export class Testimonial extends BaseDeleteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'uuid', unique: true })
  uuid!: string;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  occupation?: string;

  @Column({ nullable: true })
  rete?: number;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  link?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'bigint', nullable: true })
  userCreatedId?: number;

  @Column({ type: 'bigint', nullable: true })
  userId?: number;
}

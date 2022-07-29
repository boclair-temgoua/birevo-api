import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { BaseEntity } from './BaseEntity';

export class BaseDeleteEntity extends BaseEntity {
  @Column({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}

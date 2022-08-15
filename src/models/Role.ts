import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Subscribe } from './Subscribe';
import { BaseEntity } from '../infrastructure/databases/common/BaseEntity';

@Entity('role')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Subscribe, (subscribe) => subscribe.role)
  subscribes?: Subscribe[];
}

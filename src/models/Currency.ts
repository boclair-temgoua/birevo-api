import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Profile } from './Profile';
import { BaseDeleteEntity } from '../infrastructure/databases/common/BaseDeleteEntity';

@Entity('currency')
export class Currency extends BaseDeleteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ default: true })
  status?: boolean;

  @Column({ nullable: true })
  code?: string;

  @Column({ nullable: true })
  symbol?: string;

  @Column({ type: 'float', nullable: true })
  amount?: number;

  @OneToMany(() => Profile, (profile) => profile.currency)
  profiles?: Profile[];
}

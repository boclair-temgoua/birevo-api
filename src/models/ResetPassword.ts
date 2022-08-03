import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseDeleteEntity } from '../infrastructure/databases/common/BaseDeleteEntity';

@Entity('reset_password')
export class ResetPassword extends BaseDeleteEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  accessToken?: string;

  @Column({ nullable: true })
  token?: string;
}

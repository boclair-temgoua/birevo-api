import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseDeleteEntity } from '../infrastructure/databases/common/BaseDeleteEntity';

@Entity('country')
export class Country extends BaseDeleteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({
    type: 'uuid',
    unique: true,
    nullable: true,
  })
  uuid?: string;

  @Column({ default: false })
  code?: string;

  @Column({ nullable: true })
  name?: string;
}

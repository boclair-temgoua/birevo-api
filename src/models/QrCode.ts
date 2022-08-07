import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from '../infrastructure/databases/common/BaseEntity';

@Entity('qr_code')
export class QrCode extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ type: 'text', nullable: true })
  qrCode?: string;

  @Column({ type: 'text', nullable: true })
  barCode?: string;

  @Column({ nullable: true })
  qrCodType?: string;

  @Column({ type: 'bigint', nullable: true })
  qrCodableId?: number;
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { QrCode } from '../../../../models/QrCode';
import { CreateQrCodeOptions } from '../../types';
import { toDataURL } from 'qrcode';

@Injectable()
export class CreateOrUpdateQrCodeService {
  constructor(
    @InjectRepository(QrCode)
    private driver: Repository<QrCode>,
  ) {}

  /** Create one QrCode to the database. */
  async createOne(options: CreateQrCodeOptions): Promise<QrCode> {
    const { qrCode, barCode, qrCodType, qrCodableId } = { ...options };

    const qrCodeSave = new QrCode();
    qrCodeSave.qrCode = await toDataURL(qrCode);
    qrCodeSave.barCode = barCode;
    qrCodeSave.qrCodType = qrCodType;
    qrCodeSave.qrCodableId = qrCodableId;
    const query = this.driver.save(qrCodeSave);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }
}

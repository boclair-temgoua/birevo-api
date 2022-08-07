import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneQrCodeSelections } from '../../types';
import { QrCode } from '../../../../models/QrCode';

@Injectable()
export class FindOneQrCodeByService {
  constructor(
    @InjectRepository(QrCode)
    private driver: Repository<QrCode>,
  ) {}

  async findOneBy(selections: GetOneQrCodeSelections): Promise<QrCode> {
    const { option1 } = { ...selections };
    let query = this.driver.createQueryBuilder('qrCodeId');

    if (option1) {
      const { qrCodeId } = { ...option1 };
      query = query.where('qrCodeId.id = :id', { id: qrCodeId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('QrCode not found', HttpStatus.NOT_FOUND);

    return result;
  }
}

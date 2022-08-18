import { Injectable, NotFoundException } from '@nestjs/common';
import { Voucher } from '../../../../models/Voucher';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { generateUUID } from '../../../../infrastructure/utils/commons';
import { DatabaseUtils } from '../../../../infrastructure/utils/commons/database-utils';
import {
  CreateVoucherOptions,
  UpdateVoucherOptions,
  UpdateVoucherSelections,
} from '../../types';

@Injectable()
export class CreateOrUpdateVoucherService {
  constructor(
    @InjectRepository(Voucher)
    private driver: Repository<Voucher>,
    private dataSource: DataSource,
  ) {}

  /** Create one Voucher to the database. */
  async createOne(options: CreateVoucherOptions): Promise<any> {
    const {
      name,
      amount,
      percent,
      currencyId,
      description,
      deliveryType,
      startedAt,
      expiredAt,
      status,
      email,
      userTransactionId,
      userId,
      usedAt,
      voucherType,
      voucherCategoryId,
      applicationId,
      userCreatedId,
      organizationId,
      validity,
      code,
    } = {
      ...options,
    };

    const voucher = new Voucher();
    voucher.uuid = generateUUID();
    voucher.name = name;
    voucher.email = email;

    if (deliveryType === 'AMOUNT') {
      voucher.currencyId = currencyId;
      voucher.amount = amount;
    }
    if (deliveryType === 'PERCENT') {
      voucher.percent = percent;
    }

    voucher.code = code;
    voucher.status = status;
    voucher.usedAt = usedAt;
    voucher.startedAt = new Date(startedAt).getTime() ? startedAt : null;
    voucher.expiredAt = new Date(expiredAt).getTime() ? expiredAt : null;
    voucher.voucherType = voucherType;
    voucher.description = description;
    voucher.validity = new Date();
    voucher.deliveryType = deliveryType;
    voucher.organizationId = organizationId;
    voucher.userCreatedId = userCreatedId;
    voucher.applicationId = applicationId;
    voucher.voucherCategoryId = voucherCategoryId;
    voucher.userId = userId;
    voucher.userTransactionId = userTransactionId;

    const query = this.driver.save(voucher);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Voucher to the database. */
  async updateOne(
    selections: UpdateVoucherSelections,
    options: UpdateVoucherOptions,
  ): Promise<Voucher> {
    const { option1 } = { ...selections };
    const {
      name,
      amount,
      currencyId,
      percent,
      description,
      startedAt,
      expiredAt,
      userTransactionId,
      userId,
      email,
      applicationId,
      usedAt,
      organizationId,
      status,
      code,
      statusOnline,
      validity,
      deletedAt,
    } = {
      ...options,
    };

    let findQuery = this.driver.createQueryBuilder('voucher');

    if (option1) {
      const { uuid } = { ...option1 };
      findQuery = findQuery.andWhere('voucher.uuid = :uuid', { uuid });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.amount = amount;
    findItem.code = code;
    findItem.name = name;
    findItem.statusOnline = statusOnline;
    findItem.email = email;
    findItem.userTransactionId = userTransactionId;
    findItem.percent = percent;
    findItem.currencyId = currencyId;
    findItem.organizationId = organizationId;
    findItem.userId = userId;
    findItem.status = status;
    findItem.applicationId = applicationId;
    findItem.description = description;
    findItem.usedAt = usedAt;
    findItem.validity = validity;
    findItem.startedAt = startedAt;
    findItem.expiredAt = expiredAt;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

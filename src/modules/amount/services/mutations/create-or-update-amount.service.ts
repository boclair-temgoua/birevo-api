import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import {
  CreateAmountOptions,
  UpdateAmountSelections,
  UpdateAmountOptions,
} from '../../types/index';
import { Amount } from '../../../../models/Amount';
import {
  generateLongUUID,
  generateNumber,
} from '../../../../infrastructure/utils/commons';

@Injectable()
export class CreateOrUpdateAmountService {
  constructor(
    @InjectRepository(Amount)
    private driver: Repository<Amount>,
  ) {}

  /** Create one ApplicationToken to the database. */
  async createOne(options: CreateAmountOptions): Promise<Amount> {
    const {
      userId,
      amount,
      currency,
      type,
      urlFile,
      description,
      organizationId,
      userCreatedId,
      paymentMethod,
    } = { ...options };

    const amountSave = new Amount();
    amountSave.amount = amount;
    amountSave.currency = currency;
    amountSave.type = type;
    amountSave.token = generateLongUUID(50);
    amountSave.invoiceNumber = generateNumber(7);
    amountSave.userId = userId;
    amountSave.urlFile = urlFile;
    amountSave.description = description;
    amountSave.paymentMethod = paymentMethod;
    amountSave.organizationId = organizationId;
    amountSave.userCreatedId = userCreatedId;

    const query = this.driver.save(amountSave);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }
  /** Update one Amount to the database. */
  async updateOne(
    selections: UpdateAmountSelections,
    options: UpdateAmountOptions,
  ): Promise<Amount> {
    const { option1 } = { ...selections };
    const {
      userId,
      amount,
      currency,
      type,
      urlFile,
      description,
      organizationId,
      userCreatedId,
      paymentMethod,
    } = { ...options };

    let findQuery = this.driver.createQueryBuilder('amount');

    if (option1) {
      const { amountId } = { ...option1 };
      findQuery = findQuery.where('amount.id = :id', { id: amountId });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.urlFile = urlFile;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { ResetPassword } from '../../../../models/ResetPassword';
import { generateLongUUID } from '../../../../infrastructure/utils/commons';
import {
  CreateResetPasswordOptions,
  UpdateResetPasswordOptions,
  UpdateResetPasswordSelections,
} from '../../types';

@Injectable()
export class CreateOrUpdateResetPasswordService {
  constructor(
    @InjectRepository(ResetPassword)
    private driver: Repository<ResetPassword>,
  ) {}

  /** Create one ResetPassword to the database. */
  async createOne(options: CreateResetPasswordOptions): Promise<ResetPassword> {
    const { email, accessToken, token } = { ...options };

    const resetPassword = new ResetPassword();
    resetPassword.email = email;
    resetPassword.accessToken = accessToken;
    resetPassword.token = generateLongUUID(50);

    const query = this.driver.save(resetPassword);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one ResetPassword to the database. */
  async updateOne(
    selections: UpdateResetPasswordSelections,
    options: UpdateResetPasswordOptions,
  ): Promise<ResetPassword> {
    const { option1 } = { ...selections };
    const { deletedAt } = { ...options };

    let findQuery = this.driver.createQueryBuilder('resetPassword');

    if (option1) {
      const { token } = { ...option1 };
      findQuery = findQuery.where('resetPassword.token = :token', { token });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

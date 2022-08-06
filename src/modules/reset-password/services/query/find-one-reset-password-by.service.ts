import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneResetPasswordSelections } from '../../types';
import { ResetPassword } from '../../../../models/ResetPassword';

@Injectable()
export class FindOneResetPasswordByService {
  constructor(
    @InjectRepository(ResetPassword)
    private driver: Repository<ResetPassword>,
  ) {}

  async findOneBy(
    selections: GetOneResetPasswordSelections,
  ): Promise<ResetPassword> {
    const { option1 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('resetPw')
      .where('resetPw.deletedAt IS NULL');

    if (option1) {
      const { token } = { ...option1 };
      query = query.andWhere('resetPw.token = :token', { token });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('Reset Password not found', HttpStatus.NOT_FOUND);

    return result;
  }
}

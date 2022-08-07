import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneApplicationTokenSelections } from '../../types/index';
import { ApplicationToken } from '../../../../models/ApplicationToken';

@Injectable()
export class FindOneApplicationTokenByService {
  constructor(
    @InjectRepository(ApplicationToken)
    private driver: Repository<ApplicationToken>,
  ) {}

  async findOneBy(
    selections: GetOneApplicationTokenSelections,
  ): Promise<ApplicationToken> {
    const { option1, option2 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('applicationToken')
      .where('applicationToken.deletedAt IS NULL')
      .leftJoinAndSelect('applicationToken.application', 'application');

    if (option1) {
      const { application_Token_uuid } = { ...option1 };
      query = query.andWhere('applicationToken.uuid = :uuid', {
        uuid: application_Token_uuid,
      });
    }

    if (option2) {
      const { token } = { ...option2 };
      query = query.andWhere('applicationToken.token = :token', { token });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException(
        'ApplicationToken not found',
        HttpStatus.NOT_FOUND,
      );

    return result;
  }
}

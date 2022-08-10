import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationToken } from '../../../../models/ApplicationToken';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetCurrenciesSelections } from '../../types/index';

@Injectable()
export class FindApplicationTokenService {
  constructor(
    @InjectRepository(ApplicationToken)
    private driver: Repository<ApplicationToken>,
  ) {}

  async findAllApplications(
    selections: GetCurrenciesSelections,
  ): Promise<GetCurrenciesSelections[]> {
    const { filterQuery, option1, option2 } = { ...selections };

    let query = this.driver
      .createQueryBuilder('applicationToken')
      .select('applicationToken.userId', 'userId')
      .addSelect('applicationToken.id', 'id')
      .addSelect('applicationToken.userCreatedId', 'userCreatedId')
      .addSelect('applicationToken.applicationId', 'applicationId')
      .addSelect('applicationToken.organizationId', 'organizationId')
      .addSelect('applicationToken.token', 'token')
      .where('applicationToken.deletedAt IS NULL');

    if (option1) {
      const { userId } = { ...option1 };
      query = query.andWhere('applicationToken.userId = :userId', { userId });
    }

    if (option2) {
      const { applicationId } = { ...option2 };
      query = query.andWhere(
        'applicationToken.applicationId = :applicationId',
        { applicationId },
      );
    }

    if (filterQuery) {
      query = query.andWhere(
        'applicationToken.userId ::text ILIKE :searchQuery',
        { searchQuery: `%${filterQuery?.q}%` },
      );
    }

    const [errors, results] = await useCatch(query.getRawMany());
    if (errors) throw new NotFoundException(errors);

    return results;
  }
}

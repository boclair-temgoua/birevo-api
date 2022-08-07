import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Application } from '../../../../models/Application';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneApplicationSelections } from '../../types';

@Injectable()
export class FindOneApplicationByService {
  constructor(
    @InjectRepository(Application)
    private driver: Repository<Application>,
  ) {}

  async findOneBy(
    selections: GetOneApplicationSelections,
  ): Promise<Application> {
    const { option1, option2 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('application')
      .where('application.deletedAt IS NULL')
      .leftJoinAndSelect('application.applicationTokens', 'applicationTokens');

    if (option1) {
      const { application_uuid } = { ...option1 };
      query = query.andWhere('application.uuid = :uuid', {
        uuid: application_uuid,
      });
    }

    if (option2) {
      const { applicationId } = { ...option2 };
      query = query.andWhere('application.id = :id', { id: applicationId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('Application not found', HttpStatus.NOT_FOUND);

    return result;
  }
}

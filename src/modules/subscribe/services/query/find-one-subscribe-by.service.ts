import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Subscribe } from '../../../../models/Subscribe';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneSubscribeSelections } from '../../types';

@Injectable()
export class FindOneSubscribeByService {
  constructor(
    @InjectRepository(Subscribe)
    private driver: Repository<Subscribe>,
  ) {}

  async findOneBy(selections: GetOneSubscribeSelections): Promise<Subscribe> {
    const { option1, option3 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('subscribe')
      .leftJoinAndSelect('subscribe.organization', 'organization')
      .where('subscribe.deletedAt IS NULL');

    if (option1) {
      const { userId, subscribableId, subscribableType, organizationId } = {
        ...option1,
      };
      query = query
        .andWhere('subscribe.userId = :userId', { userId })
        .andWhere('subscribe.subscribableType = :subscribableType', {
          subscribableType,
        })
        .andWhere('subscribe.organizationId = :organizationId', {
          organizationId,
        })
        .andWhere('subscribe.subscribableId = :subscribableId', {
          subscribableId,
        });
    }

    if (option3) {
      const { subscribe_uuid } = { ...option3 };
      query = query.andWhere('subscribe.uuid = :uuid', {
        uuid: subscribe_uuid,
      });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('Subscribe not found', HttpStatus.NOT_FOUND);

    return result;
  }
}

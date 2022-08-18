import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneActivitySelections } from '../../types';
import { Activity } from '../../../../models/Activity';

@Injectable()
export class FindOneActivityByService {
  constructor(
    @InjectRepository(Activity)
    private driver: Repository<Activity>,
  ) {}

  async findOneBy(selections: GetOneActivitySelections): Promise<Activity> {
    const { option1, option2 } = { ...selections };
    let query = this.driver.createQueryBuilder('activity');

    if (option1) {
      const { ipLocation, action } = { ...option1 };
      query = query
        .where('activity.ipLocation = :ipLocation', { ipLocation })
        .andWhere('activity.action = :action', { action });
    }

    if (option2) {
      const { activity_uuid } = { ...option2 };
      query = query.where('activity.uuid = :uuid', {
        uuid: activity_uuid,
      });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);

    return result;
  }
}

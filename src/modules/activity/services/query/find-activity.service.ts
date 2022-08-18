import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { withPagination } from '../../../../infrastructure/utils/pagination';
import { GetActivitySelections } from '../../types';
import { Activity } from '../../../../models/Activity';

@Injectable()
export class FindActivityService {
  constructor(
    @InjectRepository(Activity)
    private driver: Repository<Activity>,
  ) {}

  async findAllVouchers(selections: GetActivitySelections): Promise<any> {
    const { filterQuery, is_paginate, pagination, option1 } = {
      ...selections,
    };

    let query = this.driver
      .createQueryBuilder('activity')
      .select('activity.id', 'id')
      .addSelect('activity.uuid', 'uuid')
      .addSelect('activity.action', 'action')
      .addSelect('activity.browser', 'browser')
      .addSelect('activity.os', 'os')
      .addSelect('activity.platform', 'platform')
      .addSelect('activity.source', 'source')
      .addSelect('activity.ipLocation', 'ipLocation')
      .addSelect('activity.activityAbleType', 'activityAbleType')
      .addSelect('activity.activityAbleId', 'activityAbleId')
      .addSelect(
        /*sql*/ `(
          SELECT jsonb_build_object(
          'uuid', "us"."uuid",
          'profileId', "us"."profileId",
          'firstName', "pr"."firstName",
          'lastName', "pr"."lastName",
          'color', "pr"."color",
          'image', "pr"."image"
          )
          FROM "user" "us"
          LEFT JOIN "profile" "pr" ON "us"."profileId" = "pr"."id"
          WHERE "activity"."userCreatedId" = "us"."id"
          ) AS "profileOwner"`,
      )
      .addSelect('activity.createdAt', 'createdAt');

    if (option1) {
      const { activityAbleType, activityAbleId } = { ...option1 };
      query = query
        .where('activity.activityAbleType = :activityAbleType', {
          activityAbleType,
        })
        .andWhere('activity.activityAbleId = :activityAbleId', {
          activityAbleId,
        });
    }

    if (filterQuery?.q) {
      query = query
        .andWhere('activity.view ::text ILIKE :searchQuery', {
          searchQuery: `%${filterQuery?.q}%`,
        })
        .orWhere('activity.usage ::text ILIKE :searchQuery', {
          searchQuery: `%${filterQuery?.q}%`,
        });
    }

    if (is_paginate) {
      const [errorRowCount, rowCount] = await useCatch(query.getCount());
      if (errorRowCount) throw new NotFoundException(errorRowCount);

      const [error, results] = await useCatch(
        query
          .orderBy(
            'voucher.createdAt',
            pagination?.sort ? pagination?.sort : 'DESC',
          )
          .limit(pagination.limit)
          .offset((pagination.page - 1) * pagination.limit)
          .getRawMany(),
      );
      if (error) throw new NotFoundException(error);
      return withPagination({
        pagination,
        rowCount,
        data: results,
      });
    } else {
      const [errors, results] = await useCatch(
        query.orderBy('voucher.createdAt', 'DESC').getRawMany(),
      );
      if (errors) throw new NotFoundException(errors);

      return results;
    }
  }
}

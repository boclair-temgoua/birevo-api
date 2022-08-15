import { Injectable, NotFoundException } from '@nestjs/common';
import { Subscribe } from '../../../../models/Subscribe';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { withPagination } from '../../../../infrastructure/utils/pagination';
import { GetSubscribesSelections } from '../../types';

@Injectable()
export class FindSubscribeService {
  constructor(
    @InjectRepository(Subscribe)
    private driver: Repository<Subscribe>,
  ) {}

  async findAllSubscribes(
    selections: GetSubscribesSelections,
  ): Promise<GetSubscribesSelections | any> {
    const { option1, option2, is_paginate, filterQuery, pagination } = {
      ...selections,
    };

    let query = this.driver
      .createQueryBuilder('subscribe')
      .select('subscribe.id', 'id')
      .addSelect('subscribe.uuid', 'uuid')
      .addSelect('subscribe.userCreatedId', 'userCreatedId')
      .addSelect('subscribe.subscribableType', 'subscribableType')
      .addSelect('subscribe.subscribableId', 'subscribableId')
      .addSelect('subscribe.userId', 'userId')
      .addSelect('subscribe.roleId', 'roleId')
      .addSelect('subscribe.organizationId', 'organizationId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "organization"."id",
          'email', "userOrganization"."email",
          'userId', "organization"."userId",
          'color', "organization"."color",
          'name', "organization"."name",
          'uuid', "organization"."uuid"
      ) AS "organization"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'name', "role"."name"
      ) AS "role"`,
      )
      .addSelect('subscribe.createdAt', 'createdAt');

    if (option1) {
      const { userId, subscribableType } = { ...option1 };
      query = query
        .where('subscribe.userId = :userId', { userId })
        .andWhere('subscribe.subscribableType = :subscribableType', {
          subscribableType,
        });
    }

    if (option2) {
      const { subscribableId, subscribableType } = { ...option2 };
      query = query
        .addSelect(
          /*sql*/ `jsonb_build_object(
                'firstName', "profile"."firstName",
                'image', "profile"."image",
                'color', "profile"."color",
                'lastName', "profile"."lastName",
                'userId', "user"."id",
                'email', "user"."email"
            ) AS "profile"`,
        )
        .where('subscribe.subscribableId = :subscribableId', { subscribableId })
        .andWhere('subscribe.subscribableType = :subscribableType', {
          subscribableType,
        });
    }

    if (filterQuery?.q) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('organization.name ::text ILIKE :search', {
            search: `%${filterQuery?.q}%`,
          })
            .orWhere('profile.lastName ::text ILIKE :search', {
              search: `%${filterQuery?.q}%`,
            })
            .orWhere('profile.firstName ::text ILIKE :search', {
              search: `%${filterQuery?.q}%`,
            })
            .orWhere('user.username ::text ILIKE :search', {
              search: `%${filterQuery?.q}%`,
            })
            .orWhere('user.email ::text ILIKE :search', {
              search: `%${filterQuery?.q}%`,
            });
        }),
      );
    }

    query = query
      .leftJoin('subscribe.organization', 'organization')
      .leftJoin('organization.user', 'userOrganization')
      .leftJoin('subscribe.user', 'user')
      .leftJoin('subscribe.role', 'role')
      .leftJoin('user.profile', 'profile');

    if (is_paginate) {
      const [errorRowCount, rowCount] = await useCatch(query.getCount());
      if (errorRowCount) throw new NotFoundException(errorRowCount);

      const [errors, results] = await useCatch(
        query
          .orderBy('subscribe.createdAt', pagination?.sort)
          .limit(pagination.limit)
          .offset((pagination.page - 1) * pagination.limit)
          .getRawMany(),
      );
      if (errors) throw new NotFoundException(errors);

      return withPagination({
        pagination,
        rowCount,
        data: results,
      });
    } else {
      const [errors, results] = await useCatch(
        pagination
          ? query
              .orderBy('subscribe.createdAt', pagination?.sort)
              .limit(pagination.limit)
              .getRawMany()
          : query.orderBy('subscribe.createdAt', 'DESC').getRawMany(),
      );
      if (errors) throw new NotFoundException(errors);

      return results;
    }
  }
}

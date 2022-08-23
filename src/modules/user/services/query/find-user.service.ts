import { withPagination } from '../../../../infrastructure/utils/pagination';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, Brackets } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetUsersSelections } from '../../types';
import { User } from '../../../../models/User';

@Injectable()
export class FindUserService {
  constructor(
    @InjectRepository(User)
    private driver: Repository<User>,
  ) {}

  async findAllUsers(
    selections: GetUsersSelections,
  ): Promise<GetUsersSelections> {
    const { filterQuery, pagination } = { ...selections };
    let query = this.driver
      .createQueryBuilder('user')
      .select('user.uuid', 'uuid')
      .addSelect('user.id', 'id')
      .addSelect('user.email', 'email')
      .addSelect('user.profileId', 'profileId')
      .addSelect('user.organizationInUtilizationId', 'organizationId')
      .addSelect('user.username', 'username')
      .addSelect('user.confirmedAt', 'confirmedAt')
      .addSelect(
        /*sql*/ `jsonb_build_object(
      'userId', "user"."id",
      'firstName', "profile"."firstName",
      'image', "profile"."image",
      'color', "profile"."color",
      'currencyId', "profile"."currencyId",
      'lastName', "profile"."lastName"
  ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "organization"."id",
          'uuid', "organization"."uuid",
          'color', "organization"."color",
          'userId', "organization"."userId",
          'name', "organization"."name"
      ) AS "organization"`,
      )
      .where('user.deletedAt IS NULL')
      .leftJoin('user.profile', 'profile')
      .leftJoin('user.organizationInUtilization', 'organization');

    if (filterQuery?.q) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('user.email ::text ILIKE :searchQuery', {
            searchQuery: `%${filterQuery?.q}%`,
          })
            .orWhere('user.username ::text ILIKE :searchQuery', {
              searchQuery: `%${filterQuery?.q}%`,
            })
            .orWhere('profile.firstName ::text ILIKE :searchQuery', {
              searchQuery: `%${filterQuery?.q}%`,
            })
            .orWhere('profile.lastName ::text ILIKE :searchQuery', {
              searchQuery: `%${filterQuery?.q}%`,
            });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, users] = await useCatch(
      query
        .orderBy('user.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset((pagination.page - 1) * pagination.limit)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);
    return withPagination({
      pagination,
      rowCount,
      data: users,
    });
  }
}

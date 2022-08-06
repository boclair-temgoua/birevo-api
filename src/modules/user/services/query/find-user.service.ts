import { withPagination } from './../../../../infrastructure/utils/pagination/with-pagination';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, Brackets } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetUsersSelections } from '../../types/index';
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
      .addSelect(
        /*sql*/ `jsonb_build_object(
      'userId', "user"."id",
      'firstName', "profile"."firstName",
      'image', "profile"."image",
      'currencyId', "profile"."currencyId",
      'lastName', "profile"."lastName"
  ) AS "profile"`,
      )
      .where('user.deletedAt IS NULL')
      .leftJoin('user.profile', 'profile');

    if (filterQuery?.q) {
      const qSearch = filterQuery?.q;
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('user.email ::text ILIKE :searchQuery', {
            searchQuery: `%${qSearch}%`,
          })
            .orWhere('user.username ::text ILIKE :searchQuery', {
              searchQuery: `%${qSearch}%`,
            })
            .orWhere('profile.firstName ::text ILIKE :searchQuery', {
              searchQuery: `%${qSearch}%`,
            })
            .orWhere('profile.lastName ::text ILIKE :searchQuery', {
              searchQuery: `%${qSearch}%`,
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

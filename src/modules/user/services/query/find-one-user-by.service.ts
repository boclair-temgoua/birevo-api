import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneUserSelections } from '../../types';
import { User } from '../../../../models/User';

@Injectable()
export class FindOneUserByService {
  constructor(
    @InjectRepository(User)
    private driver: Repository<User>,
  ) {}

  async findOneBy(selections: GetOneUserSelections): Promise<User> {
    const { option1, option2, option5, option6 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('user')
      .where('user.deletedAt IS NULL')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect(
        'user.organizationInUtilization',
        'organizationInUtilization',
      );

    if (option1) {
      const { userId } = { ...option1 };
      query = query.andWhere('user.id = :id', { id: userId });
    }

    if (option2) {
      const { email } = { ...option2 };
      query = query.andWhere('user.email = :email', { email });
    }

    if (option5) {
      const { token } = { ...option5 };
      query = query.andWhere('user.token = :token', { token });
    }

    if (option6) {
      const { userId, email } = { ...option6 };
      query = query
        .andWhere('user.id = :id', { id: userId })
        .andWhere('user.email = :email', { email });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return result;
  }

  async findOneInfoBy(selections: GetOneUserSelections): Promise<User> {
    const { option1, option2, option4 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('user')
      .select('user.uuid', 'uuid')
      .addSelect('user.id', 'id')
      .addSelect('user.email', 'email')
      .addSelect('user.profileId', 'profileId')
      .addSelect('user.organizationInUtilizationId', 'organizationId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
        'name', currency.name,
        'code', currency.code,
        'amount', currency.amount,
        'symbol', currency.symbol
    ) AS "currency"`,
      )
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
        /*sql*/ `(
        SELECT jsonb_build_object(
        'total', CAST(SUM("ams"."amountSubscription") AS DECIMAL)
        )
        FROM "amount_subscription" "ams"
        INNER JOIN "amount" "am" ON "ams"."amountId" = "am"."id"
        WHERE "ams"."organizationId" = "am"."organizationId"
        AND "ams"."userId" = "am"."userId"
        AND "user"."organizationInUtilizationId" = "ams"."organizationId"
        AND "user"."organizationInUtilizationId" = "am"."organizationId"
        GROUP BY "ams"."organizationId", "ams"."userId", "am"."userId", "user"."organizationInUtilizationId"
        ) AS "billing"`,
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
      .leftJoin('profile.currency', 'currency')
      .leftJoin('user.organizationInUtilization', 'organization');

    if (option1) {
      const { userId } = { ...option1 };
      query = query.andWhere('user.id = :id', { id: userId });
    }

    if (option2) {
      const { email } = { ...option2 };
      query = query.andWhere('user.email = :email', { email });
    }

    if (option4) {
      const { user_uuid } = { ...option4 };
      query = query.andWhere('user.uuid = :uuid', { uuid: user_uuid });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return result;
  }
}

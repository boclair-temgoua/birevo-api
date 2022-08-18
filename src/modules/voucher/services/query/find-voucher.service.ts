import { Injectable, NotFoundException } from '@nestjs/common';
import { Contact } from '../../../../models/Contact';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { withPagination } from '../../../../infrastructure/utils/pagination';
import { GetVoucherSelections } from '../../types';
import { Voucher } from '../../../../models/Voucher';

@Injectable()
export class FindVoucherService {
  constructor(
    @InjectRepository(Voucher)
    private driver: Repository<Voucher>,
  ) {}

  async findAllVouchers(selections: GetVoucherSelections): Promise<any> {
    const { filterQuery, is_paginate, type, status, pagination, option1 } = {
      ...selections,
    };

    let query = this.driver
      .createQueryBuilder('voucher')
      .select('voucher.id', 'id')
      .addSelect('voucher.uuid', 'uuid')
      .addSelect('voucher.code', 'code')
      .addSelect('voucher.amount', 'amount')
      .addSelect('voucher.status', 'status')
      .addSelect('voucher.name', 'name')
      .addSelect('voucher.statusOnline', 'statusOnline')
      .addSelect('voucher.expiredAt', 'expiredAt')
      .addSelect('voucher.startedAt', 'startedAt')
      .addSelect('voucher.voucherType', 'voucherType')
      .addSelect('voucher.percent', 'percent')
      .addSelect('voucher.deliveryType', 'deliveryType')
      .addSelect('voucher.email', 'email')
      .addSelect('voucher.applicationId', 'applicationId')
      .addSelect('voucher.usedAt', 'usedAt')
      .addSelect('voucher.createdAt', 'createdAt')
      .addSelect('voucher.userCreatedId', 'userCreatedId')
      .addSelect('voucher.organizationId', 'organizationId')
      .addSelect('voucher.description', 'description')
      .addSelect('currency.code', 'currency')
      .addSelect('voucher.userTransactionId', 'userTransactionId')
      .addSelect('voucher.userId', 'userId')
      .addSelect(
        /*sql*/ `
          CASE WHEN ("voucher"."expiredAt" >= now()::date) THEN false
              WHEN ("voucher"."expiredAt" < now()::date) THEN true
              ELSE false
              END
      `,
        'isExpired',
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'code', "currency"."code",
              'name', "currency"."name",
              'amount', "currency"."amount"
          ) AS "currencyItem"`,
      )
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
          WHERE "voucher"."organizationId" = "us"."id"
          ) AS "profileOwner"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT jsonb_build_object(
          'view', CAST(SUM("ac"."view") AS INT),
          'usage',  CAST(SUM("ac"."usage") AS INT)
          )
          FROM "activity" "ac"
          WHERE "ac"."activityAbleType" = "voucher"."voucherType"
          AND "ac"."activityAbleId" = "voucher"."id"
          GROUP BY "ac"."activityAbleId", "ac"."activityAbleType"
          ) AS "activity"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT jsonb_build_object(
          'uuid', "org"."uuid",
          'name', "org"."name",
          'color', "org"."color",
          'uuid', "org"."uuid"
          )
          FROM "organization" "org"
          WHERE "voucher"."organizationId" = "org"."id"
          AND "voucher"."userId" = "org"."userId"
          ) AS "organization"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT jsonb_build_object(
          'id', "app"."id",
          'name', "app"."name",
          'userId', "app"."userId",
          'createdAt', "app"."createdAt"
          )
          FROM "application" "app"
          WHERE "voucher"."applicationId" = "app"."id"
          AND "app"."deletedAt" IS NULL
          AND "app"."userId" IS NOT NULL
          ) AS "application"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT jsonb_build_object(
          'image', "qc"."qrCode"
          )
          FROM "qr_code" "qc"
          WHERE "qc"."qrCodableId" = "voucher"."id"
          ) AS "qrCode"`,
      )
      .where('voucher.voucherType = :voucherType', { voucherType: type })
      .andWhere('voucher.deletedAt IS NULL')
      .leftJoin('voucher.currency', 'currency');

    if (option1) {
      const { userId } = { ...option1 };
      query = query.andWhere('voucher.userId = :userId', { userId });
    }

    if (filterQuery?.q) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('voucher.code ::text ILIKE :searchQuery', {
            searchQuery: `%${filterQuery?.q}%`,
          }).orWhere('voucher.amount ::text ILIKE :searchQuery', {
            searchQuery: `%${filterQuery?.q}%`,
          });
        }),
      );
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

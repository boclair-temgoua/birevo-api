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
    const {
      filterQuery,
      is_paginate,
      type,
      status,
      pagination,
      option1,
      option2,
    } = {
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
      .addSelect('voucher.currencyId', 'currencyId')
      .addSelect('voucher.userCreatedId', 'userCreatedId')
      .addSelect('voucher.organizationId', 'organizationId')
      .addSelect('voucher.description', 'description')
      .addSelect('voucher.userTransactionId', 'userTransactionId')
      .addSelect('voucher.userId', 'userId')
      .addSelect(
        /*sql*/ `
      CASE WHEN ("voucher"."startedAt" >= now()::date) THEN false 
          WHEN ("voucher"."startedAt" < now()::date) THEN true
          ELSE false
          END
        `,
        'isStarted',
      )
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
        /*sql*/ `
      CASE WHEN ("voucher"."expiredAt" >= now()::date) THEN 'valid' 
          WHEN ("voucher"."expiredAt" < now()::date) THEN 'expired'
          ELSE 'valid'
          END
        `,
        'statusExpired',
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'code', "currency"."code",
              'name', "currency"."name",
              'symbol', "currency"."symbol",
              'amount', "currency"."amount"
          ) AS "currency"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT jsonb_build_object(
          'uuid', "us"."uuid",
          'profileId', "us"."profileId",
          'email', "us"."email",
          'fullName', "pr"."fullName",
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
          LEFT JOIN "organization" "org" ON "ac"."organizationId" = "org"."id"
          WHERE "ac"."activityAbleType" = "voucher"."voucherType"
          AND "ac"."activityAbleId" = "voucher"."id"
          AND "ac"."organizationId" = "voucher"."organizationId"
          GROUP BY "ac"."activityAbleId", "ac"."activityAbleType", "org"."id"
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
          'uuid', "app"."uuid",
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
      .where('voucher.deletedAt IS NULL')
      .andWhere('voucher.voucherType = :voucherType', { voucherType: type })
      .leftJoin('voucher.currency', 'currency');

    if (option1) {
      const { userId } = { ...option1 };
      query = query.andWhere('voucher.userId = :userId', { userId });
    }

    if (option2) {
      const { organizationId, statusVoucher, initiationAt, endAt } = {
        ...option2,
      };
      query = query
        .andWhere('voucher.organizationId = :organizationId', {
          organizationId,
        })
        .andWhere(
          `"voucher"."createdAt"::date BETWEEN '${initiationAt}' AND '${endAt}'`,
        );

      if (statusVoucher !== 'ALL') {
        query = query.andWhere('voucher.status = :status', {
          status: statusVoucher,
        });
      }
    }

    if (filterQuery?.q) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('voucher.code ::text ILIKE :searchQuery', {
            searchQuery: `%${filterQuery?.q}%`,
          })
            .orWhere('voucher.status ::text ILIKE :searchQuery', {
              searchQuery: `%${filterQuery?.q}%`,
            })
            .orWhere('voucher.amount ::text ILIKE :searchQuery', {
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

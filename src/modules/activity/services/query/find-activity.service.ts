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

  async findAllActivities(selections: GetActivitySelections): Promise<any> {
    const { filterQuery, isVoucherFilter, pagination, option1, option2 } = {
      ...selections,
    };

    let query = this.driver
      .createQueryBuilder('activity')
      .select('activity.id', 'id')
      .addSelect('activity.uuid', 'uuid')
      .addSelect('activity.action', 'action')
      .addSelect('activity.browser', 'browser')
      .addSelect('activity.country', 'country')
      .addSelect('activity.color', 'color')
      .addSelect('activity.city', 'city')
      .addSelect('activity.platform', 'platform')
      .addSelect('activity.organizationId', 'organizationId')
      .addSelect('activity.countryCode', 'countryCode')
      .addSelect('activity.ipLocation', 'ipLocation')
      .addSelect('activity.activityAbleType', 'activityAbleType')
      .addSelect('activity.activityAbleId', 'activityAbleId')
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
          WHERE "activity"."userCreatedId" = "us"."id"
          ) AS "profileOwner"`,
      )

      .addSelect(
        /*sql*/ `(
          SELECT jsonb_build_object(
          'uuid', "app"."uuid",
          'name', "app"."name",
          'color', "app"."color"
          )
          FROM "application" "app"
          WHERE "activity"."applicationId" = "app"."id"
          ) AS "application"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT jsonb_build_object(
        'uuid', "vo"."uuid",
        'code', "vo"."code",
        'status', "vo"."status",
        'amount', "vo"."amount",
        'expiredAt', "vo"."expiredAt",
        'startedAt', "vo"."startedAt",
        'percent', "vo"."percent",
        'currency', "cu"."code",
        'qrCode', "qc"."qrCode",
        'profile', jsonb_build_object(
          'uuid', "us"."uuid",
          'email', "us"."email",
          'profileId', "us"."profileId",
          'fullName', "pr"."fullName",
          'color', "pr"."color",
          'image', "pr"."image"
          )
        )
        FROM "voucher" "vo"
        LEFT JOIN "qr_code" "qc" ON "qc"."qrCodableId" = "vo"."id"
        LEFT JOIN "currency" "cu" ON "vo"."currencyId" = "cu"."id"
        LEFT JOIN "user" "us" ON "vo"."userCreatedId" = "us"."id"
        LEFT JOIN "profile" "pr" ON "us"."profileId" = "pr"."id"
        WHERE "vo"."id" = "activity"."activityAbleId"
        AND "vo"."organizationId" = "activity"."organizationId"
        AND "vo"."voucherType" = "activity"."activityAbleType"
        AND "activity"."activityAbleType" IN ('COUPON', 'VOUCHER')
        ) AS "voucher"`,
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

    if (option2) {
      const { organizationId } = { ...option2 };
      query = query.where('activity.organizationId = :organizationId', {
        organizationId,
      });
      if (isVoucherFilter) {
        query = query
          .andWhere("activity.activityAbleType IN ('COUPON', 'VOUCHER')")
          .andWhere(
            "activity.action IN ('VOUCHER-NEW', 'VOUCHER-USED', 'VOUCHER-VIEW')",
          );
      }
    }

    if (filterQuery?.q) {
      query = query
        .andWhere('activity.activityAbleType ::text ILIKE :searchQuery', {
          searchQuery: `%${filterQuery?.q}%`,
        })
        .andWhere('activity.action ::text ILIKE :searchQuery', {
          searchQuery: `%${filterQuery?.q}%`,
        })
        .orWhere('activity.usage ::text ILIKE :searchQuery', {
          searchQuery: `%${filterQuery?.q}%`,
        });
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, results] = await useCatch(
      query
        .orderBy(
          'activity.createdAt',
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
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Voucher } from '../../../../models/Voucher';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneVoucherSelections } from '../../types';

@Injectable()
export class FindOneVoucherByService {
  constructor(
    @InjectRepository(Voucher)
    private driver: Repository<Voucher>,
  ) {}

  async findOneBy(selections: GetOneVoucherSelections): Promise<Voucher> {
    const { option1, option2, option3, option4, option5, option6 } = {
      ...selections,
    };
    let query = this.driver
      .createQueryBuilder('voucher')
      .where('voucher.deletedAt IS NULL');

    if (option1) {
      const { uuid } = { ...option1 };
      query = query.andWhere('voucher.uuid = :uuid', { uuid });
    }

    if (option2) {
      const { code } = { ...option2 };
      query = query.andWhere('voucher.code = :code', { code });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('Voucher not found', HttpStatus.NOT_FOUND);

    return result;
  }

  async findOneInfoBy(selections: GetOneVoucherSelections): Promise<Voucher> {
    const { option1, option2, option3, option4, option5, option6 } = {
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
        /*sql*/ `jsonb_build_object(
              'userId', "user"."id",
              'user_uuid', "user"."uuid",
              'profileId', "user"."profileId",
              'firstName', "profile"."firstName",
              'lastName', "profile"."lastName",
              'color', "profile"."color",
              'image', "profile"."image"
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
          'color', "org"."color"
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
          AND "voucher"."voucherType" = "qc"."qrCodType"
          ) AS "qrCode"`,
      )
      .where('voucher.deletedAt IS NULL')
      .andWhere('voucher.validity IS NOT NULL')
      .leftJoin('voucher.currency', 'currency')
      .leftJoin('voucher.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (option1) {
      const { uuid } = { ...option1 };
      query = query.andWhere('voucher.uuid = :uuid', { uuid });
    }

    if (option2) {
      const { code } = { ...option2 };
      query = query.andWhere('voucher.code = :code', { code });
    }

    if (option3) {
      const { code, organizationId, type } = { ...option3 };
      query = query
        .andWhere('voucher.code = :code', { code })
        .andWhere('voucher.organizationId = :organizationId', {
          organizationId,
        })
        .andWhere('voucher.voucherType = :voucherType', { voucherType: type });
      //   .andWhere("voucher.status IN ('ACTIVE')");
      // if (type === 'COUPON') {
      //   query = query.andWhere('voucher.usedAt IS NULL');
      // }
    }

    if (option4) {
      const { id } = { ...option4 };
      query = query.andWhere('voucher.id = :id', { id });
    }

    if (option5) {
      const { code, organizationId } = { ...option5 };
      query = query
        .andWhere('voucher.code = :code', { code })
        .andWhere('voucher.organizationId = :organizationId', {
          organizationId,
        })
        .andWhere('voucher.usedAt IS NULL');
    }

    if (option6) {
      const { code, type } = { ...option6 };
      query = query
        .andWhere('voucher.code = :code', { code })
        .andWhere('voucher.voucherType = :voucherType', { voucherType: type })
        .andWhere("voucher.status IN ('ACTIVE')")
        .andWhere("voucher.statusOnline IN ('ONLINE')");
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('Voucher not found', HttpStatus.NOT_FOUND);

    return result;
  }
}

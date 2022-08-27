import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Organization } from '../../../../models/Organization';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneOrganizationSelections } from '../../types';

@Injectable()
export class FindOneOrganizationByService {
  constructor(
    @InjectRepository(Organization)
    private driver: Repository<Organization>,
  ) {}

  // .addSelect(
  //   /*sql*/ `(
  //   SELECT jsonb_build_object(
  //   'total', CAST(SUM("ams"."amountSubscription") AS DECIMAL)
  //   )
  //   FROM "amount_subscription" "ams"
  //   INNER JOIN "amount" "am" ON "ams"."amountId" = "am"."id"
  //   WHERE "ams"."organizationId" = "am"."organizationId"
  //   AND "ams"."userId" = "am"."userId"
  //   AND "user"."organizationInUtilizationId" = "ams"."organizationId"
  //   AND "user"."organizationInUtilizationId" = "am"."organizationId"
  //   GROUP BY "ams"."organizationId", "ams"."userId", "am"."userId", "user"."organizationInUtilizationId"
  //   ) AS "billing"`,
  // )

  async findOneBy(
    selections: GetOneOrganizationSelections,
  ): Promise<Organization> {
    const { option1, option2 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('organization')
      .select('organization.name', 'name')
      .addSelect('organization.id', 'id')
      .addSelect('organization.uuid', 'uuid')
      .addSelect('organization.color', 'color')
      .addSelect('organization.userId', 'userId')
      .addSelect(
        /*sql*/ `(
        SELECT jsonb_build_object(
        'total', CAST(SUM("ams"."amountSubscription") AS DECIMAL)
        )
        FROM "amount_subscription" "ams"
        INNER JOIN "amount" "am" ON "ams"."amountId" = "am"."id"
        WHERE "ams"."organizationId" = "am"."organizationId"
        AND "ams"."userId" = "am"."userId"
        AND "ams"."organizationId" = "organization"."id"
        AND "am"."organizationId" = "organization"."id"
        GROUP BY "ams"."organizationId", "ams"."userId", "am"."userId", "organization"."id"
        ) AS "billing"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT sr) AS INT)
      FROM "subscribe" "sr"
      WHERE ("sr"."subscribableId" = "organization"."id"
      AND "sr"."subscribableType" IN ('ORGANIZATION'))
      AND "sr"."deletedAt" IS NULL
      ) AS "contributorTotal"`,
      )
      .where('organization.deletedAt IS NULL');

    if (option1) {
      const { organizationId } = { ...option1 };
      query = query.andWhere('organization.id = :id', { id: organizationId });
    }

    if (option2) {
      const { organization_uuid } = { ...option2 };
      query = query.andWhere('organization.uuid = :uuid', {
        uuid: organization_uuid,
      });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);

    return result;
  }
}

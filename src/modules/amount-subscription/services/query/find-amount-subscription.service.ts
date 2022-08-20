import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AmountSubscription } from '../../../../models/AmountSubscription';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetAmountSubscriptionSelections } from '../../types/index';

@Injectable()
export class FindAmountSubscriptionService {
  constructor(
    @InjectRepository(AmountSubscription)
    private driver: Repository<AmountSubscription>,
  ) {}

  async findAllApplications(
    selections: GetAmountSubscriptionSelections,
  ): Promise<any> {
    const { option1, option2 } = { ...selections };

    let query = this.driver.createQueryBuilder('ams').select(/*sql*/ `(
      SELECT jsonb_build_object(
      'count', "ams"."count",
      'amountSubscription', CAST(SUM("ams"."amountSubscription") AS INT)
      )
      FROM "amount_subscription" "ams"
      INNER JOIN "amount" "am" ON "ams"."amountId" = "am"."id"
      WHERE "ams"."organizationId" = "am"."organizationId"
      AND "ams"."userId" = "am"."userId"
      GROUP BY "ams"."organizationId", "ams"."userId"
      ) AS "amountSubscriptionTotal"`);
    // .select('ams.amountSubscription', 'amountSubscription');

    if (option1) {
      const { userId } = { ...option1 };
      query = query.where('ams.userId = :userId', { userId });
    }

    if (option2) {
      const { organizationId } = { ...option2 };
      query = query.where('ams.organizationId = :organizationId', {
        organizationId,
      });
    }

    const [errors, results] = await useCatch(query.getRawMany());
    if (errors)
      throw new HttpException(
        'AmountSubscription not found',
        HttpStatus.NOT_FOUND,
      );

    return results;
  }
}

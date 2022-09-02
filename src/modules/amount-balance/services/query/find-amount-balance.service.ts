import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AmountBalance } from '../../../../models/AmountBalance';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetAmountBalanceSelections } from '../../types/index';

@Injectable()
export class FindAmountBalanceService {
  constructor(
    @InjectRepository(AmountBalance)
    private driver: Repository<AmountBalance>,
  ) {}

  async findAllApplications(
    selections: GetAmountBalanceSelections,
  ): Promise<any> {
    const { option1, option2 } = { ...selections };

    let query = this.driver.createQueryBuilder('amb').select(/*sql*/ `(
      SELECT jsonb_build_object(
      'count', "amb"."count",
      'AmountBalance', CAST(SUM("amb"."amountBalance") AS INT)
      )
      FROM "amount_balance" "amb"
      INNER JOIN "amount" "am" ON "amb"."amountId" = "am"."id"
      WHERE "amb"."organizationId" = "am"."organizationId"
      AND "amb"."userId" = "am"."userId"
      GROUP BY "amb"."organizationId", "amb"."userId"
      ) AS "AmountBalanceTotal"`);
    // .select('amb.AmountBalance', 'AmountBalance');

    if (option1) {
      const { userId } = { ...option1 };
      query = query.where('amb.userId = :userId', { userId });
    }

    if (option2) {
      const { organizationId } = { ...option2 };
      query = query.where('amb.organizationId = :organizationId', {
        organizationId,
      });
    }

    const [errors, results] = await useCatch(query.getRawMany());
    if (errors)
      throw new HttpException('AmountBalance not found', HttpStatus.NOT_FOUND);

    return results;
  }
}

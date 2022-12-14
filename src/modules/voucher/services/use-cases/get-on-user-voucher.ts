import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { FindOneVoucherByService } from '../query/find-one-voucher-by.service';
import { GetOneVoucherDto } from '../../dto/validation-voucher.dto';
import { CreateOrUpdateActivity } from '../../../activity/services/user-cases/create-or-update-activity';
import { configurations } from '../../../../infrastructure/configurations/index';
import { CreateAmountAmountUsage } from '../../../billing/services/user-cases/create-amount-amount-usage';

@Injectable()
export class GetOnUserVoucher {
  constructor(
    private readonly findOneVoucherByService: FindOneVoucherByService,
    private readonly createOrUpdateActivity: CreateOrUpdateActivity,
    private readonly createAmountAmountUsage: CreateAmountAmountUsage,
  ) {}

  /** Confirm account token to the database. */
  async executeIntern(options: GetOneVoucherDto): Promise<any> {
    const { code, voucher_uuid, ipLocation, user, userAgent } = {
      ...options,
    };

    if (code) {
      const [_errorV, findVoucher] = await useCatch(
        this.findOneVoucherByService.findOneInfoBy({
          option5: {
            code,
            organizationId: user?.organizationInUtilizationId,
          },
        }),
      );
      if (_errorV) {
        throw new NotFoundException(_errorV);
      }

      /** Here create Activity */
      const [_errorAct, _activity] = await useCatch(
        this.createOrUpdateActivity.execute({
          activityAbleType: findVoucher?.voucherType,
          activityAbleId: findVoucher?.id,
          action: 'VOUCHER-VIEW',
          ipLocation,
          browser: userAgent,
          organizationId: findVoucher?.organizationId,
          applicationId: findVoucher?.applicationId,
          userCreatedId: user?.id,
        }),
      );
      if (_errorAct) {
        throw new NotFoundException(_errorAct);
      }

      return findVoucher;
    }

    if (voucher_uuid) {
      const [_errorV, findVoucher] = await useCatch(
        this.findOneVoucherByService.findOneBy({
          option1: { uuid: voucher_uuid },
        }),
      );
      if (_errorV) {
        throw new NotFoundException(_errorV);
      }

      return findVoucher;
    }
  }

  /** Confirm find voucher to the database. */
  async executeExtern(options: GetOneVoucherDto): Promise<any> {
    const { code, type, ipLocation, user, userAgent } = { ...options };

    const [_errorV, findVoucher] = await useCatch(
      this.findOneVoucherByService.findOneInfoBy({
        option3: {
          code,
          type,
          organizationId: user?.applicationToken?.organizationId,
        },
      }),
    );
    if (_errorV) {
      throw new NotFoundException(_errorV);
    }
    if (!findVoucher)
      throw new HttpException(
        `Invalid coupon or voucher please try again`,
        HttpStatus.NOT_FOUND,
      );

    if (findVoucher) {
      /** Ici je cree la transaction pour le payment de la requete */

      /** Start */
      const [_errorBull, bulling] = await useCatch(
        this.createAmountAmountUsage.execute({
          amount: configurations.datasite.pricingBilling,
          currency: 'EUR',
          paymentMethod: 'VIEW-VOUCHER',
          description: 'View voucher',
          userId: user?.applicationToken?.userId,
          organizationId: user?.applicationToken?.organizationId,
          userCreatedId: user?.applicationToken?.userId,
        }),
      );
      if (_errorBull) {
        throw new NotFoundException(_errorBull);
      }
      /** End */

      /** Here create Activity */
      const [_errorAct, _activity] = await useCatch(
        this.createOrUpdateActivity.execute({
          activityAbleType: findVoucher?.voucherType,
          activityAbleId: findVoucher?.id,
          action: 'VOUCHER-VIEW',
          ipLocation,
          browser: userAgent,
          organizationId: findVoucher?.organizationId,
          applicationId: findVoucher?.applicationId,
          userCreatedId: user?.id,
        }),
      );
      if (_errorAct) {
        throw new NotFoundException(_errorAct);
      }
    }

    return findVoucher;
  }
}

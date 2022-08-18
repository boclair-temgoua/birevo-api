import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { useCatch } from 'src/infrastructure/utils/use-catch';
import { FindOneVoucherByService } from '../query/find-one-voucher-by.service';
import { GetOneVoucherDto } from '../../dto/validation-voucher.dto';
import { CreateOrUpdateActivity } from '../../../activity/services/user-cases/create-or-update-activity';

@Injectable()
export class GetOnUserVoucher {
  constructor(
    private readonly findOneVoucherByService: FindOneVoucherByService,
    private readonly createOrUpdateActivity: CreateOrUpdateActivity,
  ) {}

  /** Confirm account token to the database. */
  async executeIntern(options: GetOneVoucherDto): Promise<any> {
    const { code, voucher_uuid, ipLocation, user, userAgent } = { ...options };

    if (code) {
      const [_errorV, findVoucher] = await useCatch(
        this.findOneVoucherByService.findOneInfoBy({ option2: { code } }),
      );
      if (_errorV) {
        throw new NotFoundException(_errorV);
      }

      /** Here create Activity */
      const [_errorAct, _activity] = await useCatch(
        this.createOrUpdateActivity.execute({
          activityAbleType: findVoucher?.voucherType,
          activityAbleId: findVoucher?.id,
          action: 'VIEW',
          ipLocation,
          browser: userAgent,
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

  /** Confirm account token to the database. */
  async executeExtern(options: GetOneVoucherDto): Promise<any> {
    const { code, ipLocation, user, userAgent } = { ...options };

    const [_errorV, findVoucher] = await useCatch(
      this.findOneVoucherByService.findOneInfoBy({
        option3: {
          code,
          type: 'COUPON',
          organizationId: user?.applicationToken?.organizationId,
        },
      }),
    );
    if (_errorV) {
      throw new NotFoundException(_errorV);
    }

    if (findVoucher) {
      /** Here create Activity */
      const [_errorAct, _activity] = await useCatch(
        this.createOrUpdateActivity.execute({
          activityAbleType: findVoucher?.voucherType,
          activityAbleId: findVoucher?.id,
          action: 'VIEW',
          ipLocation,
          browser: userAgent,
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

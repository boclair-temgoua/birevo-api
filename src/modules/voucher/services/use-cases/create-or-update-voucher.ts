import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import {
  CreateOrUpdateVoucherDto,
  getOneVoucherType,
} from '../../dto/validation-voucher.dto';
import { FindOneVoucherByService } from '../query/find-one-voucher-by.service';
import { FindOneCurrencyByService } from '../../../currency/services/query/find-one-currency-by.service';
import { CreateOrUpdateVoucherService } from '../mutations/create-or-update-voucher.service';
import { generateCouponCode } from '../../../../infrastructure/utils/commons/generate-coupon-code';
import { CreateOrUpdateQrCodeService } from '../../../qr-code/services/mutations/create-or-update-qr-code.service';
import { CodeVoucherDto } from '../../dto/validation-voucher.dto';
import { CreateOrUpdateActivity } from '../../../activity/services/user-cases/create-or-update-activity';
import { configurations } from '../../../../infrastructure/configurations/index';
import { CreateAmountAmountUsage } from '../../../billing/services/user-cases/create-amount-amount-usage';

@Injectable()
export class CreateOrUpdateVoucher {
  constructor(
    private readonly createAmountAmountUsage: CreateAmountAmountUsage,
    private readonly findOneVoucherByService: FindOneVoucherByService,
    private readonly createOrUpdateQrCodeService: CreateOrUpdateQrCodeService,
    private readonly createOrUpdateVoucherService: CreateOrUpdateVoucherService,
    private readonly createOrUpdateActivity: CreateOrUpdateActivity,
  ) {}

  /** Confirm account token to the database. */
  async create(options: CreateOrUpdateVoucherDto): Promise<any> {
    const { code, user, numberGenerate } = { ...options };

    const [_errorV, findVoucher] = await useCatch(
      this.findOneVoucherByService.findOneBy({
        option5: {
          code,
          organizationId:
            user?.applicationToken?.organizationId ||
            user?.organizationInUtilizationId,
        },
      }),
    );
    if (_errorV) {
      throw new NotFoundException(_errorV);
    }

    if (findVoucher)
      throw new HttpException(
        `Code ${code} already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    if (numberGenerate) {
      for (let i = 0; i < numberGenerate; i++) {
        const [errorSave, coupon] = await useCatch(
          this.createOneVoucher({ ...options }),
        );
        if (errorSave) {
          throw new NotFoundException(errorSave);
        }
      }
    } else {
      const [errorSave, coupon] = await useCatch(
        this.createOneVoucher({ ...options }),
      );
      if (errorSave) {
        throw new NotFoundException(errorSave);
      }
    }

    return options;
  }

  /** Use voucher account token to the database. */
  async useVoucherExternOrInterne(options: CodeVoucherDto): Promise<any> {
    const { code, type, user, ipLocation, userAgent } = { ...options };

    const [_errorV, findVoucher] = await useCatch(
      this.findOneVoucherByService.findOneInfoBy({
        option3: {
          code,
          type: 'COUPON',
          organizationId:
            user?.applicationToken?.organizationId ||
            user?.organizationInUtilizationId,
        },
      }),
    );
    if (_errorV) {
      throw new NotFoundException(_errorV);
    }

    if (!findVoucher)
      throw new HttpException(
        `Invalid voucher please try again`,
        HttpStatus.NOT_FOUND,
      );

    /** Ici je met a jour le coupon dans la base de donner */
    if (findVoucher?.voucherType === 'COUPON') {
      /** Ici je cree la transaction pour le payment de la requete */

      /** Start */

      /** Ici je met a jour le payment de la requete du coupon */
      const [_errorBull, bulling] = await useCatch(
        this.createAmountAmountUsage.execute({
          amount: configurations.datasite.pricingBilling,
          currency: 'EUR',
          userId: findVoucher?.userId,
          paymentMethod: 'USED-COUPON',
          description: 'Use coupon',
          organizationId: findVoucher?.organizationId,
          userCreatedId: user?.id,
        }),
      );
      if (_errorBull) {
        throw new NotFoundException(_errorBull);
      }

      const [_errorV, _updateV] = await useCatch(
        this.createOrUpdateVoucherService.updateOne(
          { option1: { uuid: findVoucher?.uuid } },
          {
            usedAt: new Date(),
            validity: null,
            status: 'USED',
            statusOnline: 'OFFLINE',
          },
        ),
      );
      if (_errorV) {
        throw new NotFoundException(_errorV);
      }
    }

    if (findVoucher) {
      /** Here create Activity */
      const [_errorAct, _activity] = await useCatch(
        this.createOrUpdateActivity.execute({
          activityAbleType: findVoucher?.voucherType,
          activityAbleId: findVoucher?.id,
          action: 'VOUCHER-USED',
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

  /** Delete voucher account token to the database. */
  async deleteVoucherExtern(options: CodeVoucherDto): Promise<any> {
    const { code, user, ipLocation, userAgent } = { ...options };

    const [_errorV, findVoucher] = await useCatch(
      this.findOneVoucherByService.findOneInfoBy({
        option5: {
          code,
          organizationId:
            user?.applicationToken?.organizationId ||
            user?.organizationInUtilizationId,
        },
      }),
    );
    if (_errorV) {
      throw new NotFoundException(_errorV);
    }

    if (!findVoucher)
      throw new HttpException(
        `Invalid voucher please try again`,
        HttpStatus.NOT_FOUND,
      );
    // /** Ici je met a jour le coupon dans la base de donner */
    const [_errorD, _updateV] = await useCatch(
      this.createOrUpdateVoucherService.updateOne(
        { option1: { uuid: findVoucher?.uuid } },
        { deletedAt: new Date(), usedAt: new Date(), validity: null },
      ),
    );
    if (_errorD) {
      throw new NotFoundException(_errorV);
    }

    /** Here create Activity */
    const [_errorAct, _activity] = await useCatch(
      this.createOrUpdateActivity.execute({
        activityAbleType: findVoucher?.voucherType,
        activityAbleId: findVoucher?.id,
        action: 'DELETE',
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

    return { id: findVoucher?.uuid, code: findVoucher?.code };
  }

  /** Ce code me sert a pouvoir sauvegarder plusieur voucher. */
  async createOneVoucher(options: CreateOrUpdateVoucherDto): Promise<any> {
    const {
      name,
      status,
      email,
      amount,
      description,
      type,
      code,
      currencyId,
      ipLocation,
      userAgent,
      percent,
      startedAt,
      expiredAt,
      deliveryType,
      applicationId,
      user,
    } = {
      ...options,
    };

    const [errorSave, coupon] = await useCatch(
      this.createOrUpdateVoucherService.createOne({
        name,
        amount: Number(amount),
        currencyId: Number(currencyId),
        voucherCategoryId: getOneVoucherType(type),
        voucherType: type,
        code: code ? code : generateCouponCode(16),
        deliveryType,
        description,
        email,
        startedAt,
        expiredAt,
        status,
        percent: percent,
        organizationId: user?.organizationInUtilizationId,
        userCreatedId: user?.id,
        userId: user?.organizationInUtilization?.userId,
        applicationId: applicationId || user?.applicationToken?.applicationId,
      }),
    );
    if (errorSave) {
      throw new NotFoundException(errorSave);
    }
    /** Here create QRCode */
    const [_errorQr, _qrcode] = await useCatch(
      this.createOrUpdateQrCodeService.createOne({
        qrCode: coupon?.code,
        qrCodType: coupon?.voucherType,
        qrCodableId: coupon?.id,
      }),
    );
    if (_errorQr) {
      throw new NotFoundException(_errorQr);
    }

    /** Here create Activity */
    const [_errorAct, _activity] = await useCatch(
      this.createOrUpdateActivity.execute({
        activityAbleType: coupon?.voucherType,
        activityAbleId: coupon?.id,
        action: 'VOUCHER-NEW',
        ipLocation,
        browser: userAgent,
        organizationId: coupon?.organizationId,
        applicationId: coupon?.applicationId,
        userCreatedId: coupon?.userCreatedId,
      }),
    );
    if (_errorAct) {
      throw new NotFoundException(_errorAct);
    }
  }
}

import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { useCatch } from 'src/infrastructure/utils/use-catch';
import {
  CreateOrUpdateVoucherDto,
  getOneVoucherType,
} from '../../dto/validation-voucher.dto';
import { FindOneVoucherByService } from '../query/find-one-voucher-by.service';
import { FindOneCurrencyByService } from '../../../currency/services/query/find-one-currency-by.service';
import { CreateOrUpdateVoucherService } from '../mutations/create-or-update-voucher.service';
import { generateCouponCode } from '../../../../infrastructure/utils/commons/generate-coupon-code';
import { CreateOrUpdateQrCodeService } from '../../../qr-code/services/mutations/create-or-update-qr-code.service';
import { GetAuthorizationToSubscribe } from '../../../subscribe/services/use-cases/get-authorization-to-subscribe';
import { UnauthorizedException } from '@nestjs/common';
import { CodeVoucherDto } from '../../dto/validation-voucher.dto';
import { CreateOrUpdateActivity } from '../../../activity/services/user-cases/create-or-update-activity';

@Injectable()
export class CreateOrUpdateVoucher {
  constructor(
    private readonly findOneVoucherByService: FindOneVoucherByService,
    private readonly createOrUpdateQrCodeService: CreateOrUpdateQrCodeService,
    private readonly findOneCurrencyByService: FindOneCurrencyByService,
    private readonly createOrUpdateVoucherService: CreateOrUpdateVoucherService,
    private readonly getAuthorizationToSubscribe: GetAuthorizationToSubscribe,
    private readonly createOrUpdateActivity: CreateOrUpdateActivity,
  ) {}

  /** Confirm account token to the database. */
  async create(options: CreateOrUpdateVoucherDto): Promise<any> {
    const {
      name,
      currency,
      status,
      email,
      amount,
      description,
      type,
      code,
      voucherId,
      percent,
      startedAt,
      expiredAt,
      deliveryType,
      applicationId,
      user,
    } = {
      ...options,
    };

    // Check permission user action
    const [_errorOr, result] = await useCatch(
      this.getAuthorizationToSubscribe.execute({
        organizationId: user?.applicationToken?.token
          ? user?.applicationToken?.organizationId
          : user?.organizationInUtilizationId,
        userId: user?.id,
        type: 'ORGANIZATION',
      }),
    );
    if (_errorOr) {
      throw new NotFoundException(_errorOr);
    }
    if (!result?.subscribeOrganization) throw new UnauthorizedException();

    const [_errorC, findCurrency] = await useCatch(
      this.findOneCurrencyByService.findOneBy({ option2: { code: currency } }),
    );
    if (_errorC) {
      throw new NotFoundException(_errorC);
    }

    const [_errorV, findVoucher] = await useCatch(
      this.findOneVoucherByService.findOneBy({
        option5: {
          code,
          organizationId: result?.subscribeOrganization?.organizationId,
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

    const [errorSave, coupon] = await useCatch(
      this.createOrUpdateVoucherService.createOne({
        name,
        amount: Number(amount),
        currencyId: findCurrency?.id,
        voucherCategoryId: getOneVoucherType(type),
        voucherType: type,
        code: code ? code : generateCouponCode(16),
        deliveryType,
        description,
        email,
        startedAt,
        expiredAt,
        status,
        percent: Number(percent),
        organizationId: user?.organizationInUtilizationId,
        userCreatedId: user?.id,
        userId: result?.subscribeOrganization?.userId,
        applicationId: applicationId
          ? applicationId
          : user?.applicationToken?.applicationId,
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
    return coupon;
  }

  /** Use voucher account token to the database. */
  async useVoucherExternOrInterne(options: CodeVoucherDto): Promise<any> {
    const { code, type, user, ipLocation, userAgent } = { ...options };

    const [_errorV, findVoucher] = await useCatch(
      this.findOneVoucherByService.findOneInfoBy({
        option3: {
          code,
          type: 'COUPON',
          organizationId: user?.applicationToken?.token
            ? user?.applicationToken?.organizationId
            : user?.organizationInUtilizationId,
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
          action: 'USED',
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

  /** Delete voucher account token to the database. */
  async deleteVoucherExtern(options: CodeVoucherDto): Promise<any> {
    const { code, user, ipLocation, userAgent } = { ...options };

    const [_errorV, findVoucher] = await useCatch(
      this.findOneVoucherByService.findOneInfoBy({
        option5: {
          code,
          organizationId: user?.applicationToken?.token
            ? user?.applicationToken?.organizationId
            : user?.organizationInUtilizationId,
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
        applicationId: findVoucher?.applicationId,
        userCreatedId: user?.id,
      }),
    );
    if (_errorAct) {
      throw new NotFoundException(_errorAct);
    }

    return { id: findVoucher?.uuid, code: findVoucher?.code };
  }
}

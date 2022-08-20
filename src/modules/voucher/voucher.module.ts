import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from '../../models/Voucher';
import { AuthTokenMiddleware } from '../user/middleware/auth-token.middleware';
import { FindOneApplicationTokenByService } from '../application-token/services/query/find-one-application-token-by.service';
import { FindOneUserByService } from '../user/services/query/find-one-user-by.service';
import { ApplicationToken } from '../../models/ApplicationToken';
import { User } from '../../models/User';
import { FindOneVoucherByService } from './services/query/find-one-voucher-by.service';
import { FindVoucherService } from './services/query/find-voucher.service';
import { CreateOrUpdateVoucherService } from './services/mutations/create-or-update-voucher.service';

import { CreateOrUpdateVoucher } from './services/use-cases/create-or-update-voucher';
import { FindOneCurrencyByService } from '../currency/services/query/find-one-currency-by.service';
import { Currency } from '../../models/Currency';
import { CreateOrUpdateQrCodeService } from '../qr-code/services/mutations/create-or-update-qr-code.service';
import { QrCode } from '../../models/QrCode';
import { GetOnUserVoucher } from './services/use-cases/get-on-user-voucher';
import { GetAuthorizationToSubscribe } from '../subscribe/services/use-cases/get-authorization-to-subscribe';
import { Subscribe } from '../../models/Subscribe';
import { Organization } from '../../models/Organization';
import { FindOneSubscribeByService } from '../subscribe/services/query/find-one-subscribe-by.service';
import { FindOneOrganizationByService } from '../organization/services/query/find-one-organization-by.service';
import {
  CreateOrUpdateExternalVoucherController,
  CreateOrUpdateInternalCouponController,
  GetOneOrMultipleInternalVoucherController,
} from './controllers';
import { GetOneOrMultipleExternalVoucherController } from './controllers/api-external/get-one-or-multiple-external-voucher.controller';
import { Activity } from '../../models/Activity';
import { CreateOrUpdateActivity } from '../activity/services/user-cases/create-or-update-activity';
import { CreateOrUpdateActivityService } from '../activity/services/mutations/create-or-update-activity.service';
import { CreateAmountAmountSubscription } from '../billing/services/user-cases/create-amount-amountSubscription';
import { Amount } from '../../models/Amount';
import { AmountSubscription } from '../../models/AmountSubscription';
import { CreateOrUpdateAmountSubscriptionService } from '../amount-subscription/services/mutations/create-or-update-amount-subscription.service';
import { CreateOrUpdateAmountService } from '../amount/services/mutations/create-or-update-amount.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Voucher]),
    TypeOrmModule.forFeature([QrCode]),
    TypeOrmModule.forFeature([Activity]),
    TypeOrmModule.forFeature([Currency]),
    TypeOrmModule.forFeature([Subscribe]),
    TypeOrmModule.forFeature([Organization]),
    TypeOrmModule.forFeature([ApplicationToken]),
    TypeOrmModule.forFeature([Amount]),
    TypeOrmModule.forFeature([AmountSubscription]),
  ],
  controllers: [
    CreateOrUpdateExternalVoucherController,
    CreateOrUpdateInternalCouponController,
    GetOneOrMultipleInternalVoucherController,
    GetOneOrMultipleExternalVoucherController,
  ],
  providers: [
    /** Imports providers query */
    FindVoucherService,
    FindOneUserByService,
    FindOneVoucherByService,
    GetAuthorizationToSubscribe,
    FindOneSubscribeByService,
    FindOneOrganizationByService,

    /** Imports providers mutations */
    CreateOrUpdateVoucherService,
    CreateOrUpdateQrCodeService,
    FindOneCurrencyByService,
    CreateOrUpdateActivityService,

    /** Imports providers use-cases */
    GetOnUserVoucher,
    CreateOrUpdateActivity,
    CreateOrUpdateVoucher,
    CreateAmountAmountSubscription,
    CreateOrUpdateAmountSubscriptionService,
    CreateOrUpdateAmountService,

    /** Integrate user token middleware */
    FindOneApplicationTokenByService,
  ],
})
export class VoucherModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthTokenMiddleware)
      .forRoutes(
        CreateOrUpdateExternalVoucherController,
        GetOneOrMultipleExternalVoucherController,
      );
  }
}

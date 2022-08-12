import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from '../../../models/Voucher';
import { AuthTokenMiddleware } from '../../user/middleware/auth-token.middleware';
import { FindOneApplicationTokenByService } from '../../application-token/services/query/find-one-application-token-by.service';
import { FindOneUserByService } from '../../user/services/query/find-one-user-by.service';
import { ApplicationToken } from '../../../models/ApplicationToken';
import { User } from '../../../models/User';
import { FindOneVoucherByService } from '../services/query/find-one-voucher-by.service';
import { FindVoucherService } from '../services/query/find-voucher.service';
import { CreateOrUpdateVoucherService } from '../services/mutations/create-or-update-voucher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([ApplicationToken]),
    TypeOrmModule.forFeature([Voucher]),
  ],
  controllers: [],
  providers: [
    /** Imports providers query */
    FindVoucherService,
    FindOneVoucherByService,

    /** Imports providers mutations */
    CreateOrUpdateVoucherService,
    /** Imports providers use-cases */

    /** Integrate user token middleware */
    FindOneUserByService,
    FindOneApplicationTokenByService,
  ],
})
export class VoucherExternalModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthTokenMiddleware).forRoutes('*');
  }
}

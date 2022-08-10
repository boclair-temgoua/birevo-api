import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from '../../../models/Voucher';
import { FindOneVoucherByService } from '../services/query/find-one-voucher-by.service';
import { FindVoucherService } from '../services/query/find-voucher.service';
import { CreateOrUpdateVoucherService } from '../services/mutations/create-or-update-voucher.service';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher])],
  controllers: [
    // CreateOrUpdateApplicationController,
    // GetOneOrMultipleApplicationController,
  ],
  providers: [
    /** Imports providers query */
    FindOneVoucherByService,
    FindVoucherService,

    /** Imports providers mutations */
    CreateOrUpdateVoucherService,
    /** Imports providers use-cases */
  ],
})
export class VoucherInterneModule {}

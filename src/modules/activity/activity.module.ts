import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../../models/Activity';
import { FindOneActivityByService } from './services/query/find-one-activity-by.service';
import { FindActivityService } from './services/query/find-activity.service';
import { CreateOrUpdateActivityService } from './services/mutations/create-or-update-activity.service';
import { CreateOrUpdateActivity } from './services/user-cases/create-or-update-activity';
import { GetOneOrMultipleExternalActivityController } from './controllers/get-one-or-multiple-external-activity.controller';
import { FindOneVoucherByService } from '../voucher/services/query/find-one-voucher-by.service';
import { Voucher } from '../../models/Voucher';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity]),
    TypeOrmModule.forFeature([Voucher]),
  ],
  controllers: [GetOneOrMultipleExternalActivityController],
  providers: [
    /** Imports providers query */
    FindActivityService,
    FindOneActivityByService,
    /** Imports providers mutations */
    CreateOrUpdateActivityService,
    FindOneVoucherByService,
    /** Imports providers use-cases */
    CreateOrUpdateActivity,
  ],
})
export class ActivityModule {}

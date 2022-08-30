import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../../models/Activity';
import { FindOneActivityByService } from './services/query/find-one-activity-by.service';
import { FindActivityService } from './services/query/find-activity.service';
import { CreateOrUpdateActivityService } from './services/mutations/create-or-update-activity.service';
import { CreateOrUpdateActivity } from './services/user-cases/create-or-update-activity';
import { GetOneOrMultipleActivityController } from './controllers/get-one-or-multiple-activity.controller';
import { FindOneVoucherByService } from '../voucher/services/query/find-one-voucher-by.service';
import { Voucher } from '../../models/Voucher';
import { GetOneOrMultipleActivity } from './services/user-cases/get-one-or-multiple-activity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity]),
    TypeOrmModule.forFeature([Voucher]),
  ],
  controllers: [GetOneOrMultipleActivityController],
  providers: [
    /** Imports providers query */
    FindActivityService,
    FindOneActivityByService,
    /** Imports providers mutations */
    CreateOrUpdateActivityService,
    FindOneVoucherByService,
    /** Imports providers use-cases */
    CreateOrUpdateActivity,
    GetOneOrMultipleActivity,
  ],
})
export class ActivityModule {}

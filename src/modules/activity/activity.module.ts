import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../../models/Activity';
import { FindOneActivityByService } from './services/query/find-one-activity-by.service';
import { FindActivityService } from './services/query/find-activity.service';
import { CreateOrUpdateActivityService } from './services/mutations/create-or-update-activity.service';
import { CreateOrUpdateActivity } from './services/user-cases/create-or-update-activity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  controllers: [],
  providers: [
    /** Imports providers query */
    FindActivityService,
    FindOneActivityByService,
    /** Imports providers mutations */
    CreateOrUpdateActivityService,
    /** Imports providers use-cases */
    CreateOrUpdateActivity,
  ],
})
export class ActivityModule {}

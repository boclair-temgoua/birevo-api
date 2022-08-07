import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../../models/Application';
import { FindOneApplicationByService } from './services/query/find-one-application-by.service';
import {
  CreateOrUpdateApplicationController,
  GetOneOrMultipleApplicationController,
} from './controllers';
import { FindApplicationService } from './services/query/find-application.service';
import { CreateOrUpdateApplicationService } from './services/mutations/create-or-update-application.service';
import {
  CreateOneApplicationTokenApplication,
  CreateOrUpdateApplication,
} from './services/use-cases';
import { ApplicationToken } from '../../models/ApplicationToken';
import { CreateOrUpdateApplicationTokenService } from '../application-token/services/mutations/create-or-update-application-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    TypeOrmModule.forFeature([ApplicationToken]),
  ],
  controllers: [
    CreateOrUpdateApplicationController,
    GetOneOrMultipleApplicationController,
  ],
  providers: [
    /** Imports providers query */
    FindOneApplicationByService,
    FindApplicationService,

    /** Imports providers mutations */
    CreateOrUpdateApplicationService,
    CreateOrUpdateApplicationTokenService,

    /** Imports providers use-cases */
    CreateOrUpdateApplication,
    CreateOneApplicationTokenApplication,
  ],
})
export class ApplicationModule {}

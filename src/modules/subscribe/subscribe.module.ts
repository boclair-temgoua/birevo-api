import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscribe } from '../../models/Subscribe';
import { FindOneSubscribeByService } from './services/query/find-one-subscribe-by.service';

import { FindSubscribeService } from './services/query/find-subscribe.service';
import { CreateOrUpdateSubscribeService } from './services/mutations/create-or-update-subscribe.service';
import { FindOneApplicationTokenByService } from '../application-token/services/query/find-one-application-token-by.service';
import { ApplicationToken } from '../../models/ApplicationToken';
import { FindOneUserByService } from '../user/services/query/find-one-user-by.service';
import { User } from '../../models/User';
import { HttpModule } from '@nestjs/axios';
import {
  GetOneOrMultipleSubscribeController,
  CreateOrUpdateOneSubscribeController,
} from './controllers';
import {
  GetAuthorizationToSubscribe,
  CreateOneContributorToSubscribe,
} from './services/use-cases';
import { Organization } from '../../models/Organization';
import { FindOneOrganizationByService } from '../organization/services/query/find-one-organization-by.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User, Subscribe, Organization, ApplicationToken]),
  ],
  controllers: [
    GetOneOrMultipleSubscribeController,
    CreateOrUpdateOneSubscribeController,
  ],
  providers: [
    FindSubscribeService,
    FindOneSubscribeByService,
    CreateOrUpdateSubscribeService,

    /** Integrate user token middleware */
    FindOneUserByService,
    FindOneOrganizationByService,
    FindOneApplicationTokenByService,

    /** Use case */
    GetAuthorizationToSubscribe,
    CreateOneContributorToSubscribe,
  ],
})
export class SubscribeModule {}

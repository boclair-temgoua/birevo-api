import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscribe } from '../../models/Subscribe';
import { FindOneSubscribeByService } from './services/query/find-one-subscribe-by.service';

import { FindSubscribeService } from './services/query/find-subscribe.service';
import { CreateOrUpdateSubscribeService } from './services/mutations/create-or-update-subscribe.service';
import { FindOneApplicationTokenByService } from '../application-token/services/query/find-one-application-token-by.service';
import { ApplicationToken } from '../../models/ApplicationToken';
import { AuthTokenMiddleware } from '../user/middleware';
import { FindOneUserByService } from '../user/services/query/find-one-user-by.service';
import { User } from '../../models/User';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Subscribe]),
    TypeOrmModule.forFeature([ApplicationToken]),
  ],
  controllers: [],
  providers: [
    FindOneSubscribeByService,
    FindSubscribeService,
    CreateOrUpdateSubscribeService,

    /** Integrate user token middleware */
    FindOneApplicationTokenByService,
    FindOneUserByService,
  ],
})
export class SubscribeModule {}

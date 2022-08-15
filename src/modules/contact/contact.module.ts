import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from '../../models/Contact';
import { FindOneContactByService } from './services/query/find-one-contact-by.service';
import {
  GetContactController,
  GetOneContactController,
  CreateContactController,
  UpdateContactController,
} from './controllers';
import { FindContactService } from './services/query/find-contact.service';
import { CreateOrUpdateContactService } from './services/mutations/create-or-update-contact.service';
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
    TypeOrmModule.forFeature([Contact]),
    TypeOrmModule.forFeature([ApplicationToken]),
  ],
  controllers: [
    GetContactController,
    GetOneContactController,
    CreateContactController,
    UpdateContactController,
  ],
  providers: [
    FindOneContactByService,
    FindContactService,
    CreateOrUpdateContactService,

    /** Integrate user token middleware */
    FindOneApplicationTokenByService,
    FindOneUserByService,
  ],
})
export class ContactModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthTokenMiddleware).forRoutes(GetOneContactController);
  }
}
// export class ContactModule {}

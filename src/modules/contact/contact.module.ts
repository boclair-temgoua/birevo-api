import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from '../../models/Contact';
import { FindOneContactByService } from './services/query/find-one-contact-by.service';
import { GetContactController, GetOneContactController } from './controllers';
import { FindContactService } from './services/query/find-contact.service';
import { CreateContactController } from './controllers/create-contact.controller';
import { CreateContactService } from './services/mutations/create-contact.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  controllers: [
    GetContactController,
    GetOneContactController,
    CreateContactController,
  ],
  providers: [
    FindOneContactByService,
    FindContactService,
    CreateContactService,
  ],
})
export class ContactModule {}

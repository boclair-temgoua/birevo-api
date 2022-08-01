import { Module } from '@nestjs/common';
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

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
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
  ],
})
export class ContactModule {}

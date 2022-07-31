import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from '../../models/Contact';
import { FindOneContactByService } from './services/query/find-one-contact-by.service';
import { GetContactController, GetOneContactController } from './controllers';
import { FindContactService } from './services/query/find-contact.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  controllers: [GetContactController, GetOneContactController],
  providers: [FindOneContactByService, FindContactService],
})
export class ContactModule {}

import { Controller, Get, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AppService } from './app.service';
import { User } from '../../models/User';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [
    // GetContactController,
    // GetOneContactController,
    // CreateContactController,
    // UpdateContactController,
  ],
  providers: [
    // FindOneContactByService,
    // FindContactService,
    // CreateOrUpdateContactService,
  ],
})
export class UserModule {}

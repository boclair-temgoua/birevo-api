import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddress } from '../../models/UserAddress';
import {
  CreateOrUpdateUserAddressController,
  GetOneOrMultipleUserAddressController,
} from './controllers';
import { CreateOrUpdateUserAddressService } from './services/mutations/create-or-update-user-address.service';
import { FindOneUserAddressByService } from './services/query/find-one-user-address-by.service';
import { FindUserAddressService } from './services/query/find-user-address.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddress])],
  controllers: [
    CreateOrUpdateUserAddressController,
    GetOneOrMultipleUserAddressController,
  ],
  providers: [
    FindUserAddressService,
    CreateOrUpdateUserAddressService,
    FindOneUserAddressByService,
  ],
})
export class UserAddressModule {}

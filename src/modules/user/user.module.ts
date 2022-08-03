import { CreateOrUpdateProfileService } from './../profile/services/mutations/create-or-update-profile.service';
import { FindOneUserByService } from './services/query/find-one-user-by.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/User';
import { FindUserService } from './services/query/find-user.service';
import { CreateOrUpdateUserService } from './services/mutations/create-or-update-user.service';
import { AuthRegisterController } from './controllers/auth/auth-register.controller';
import { CreateRegisterUserService } from './services/mutations/create-register-user.service';
import { Profile } from '../../models/Profile';
import { Organization } from '../../models/Organization';
import { CreateOrUpdateOrganizationService } from '../organization/services/mutations/create-or-update-organization.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Profile]),
    TypeOrmModule.forFeature([Organization]),
  ],
  controllers: [AuthRegisterController],
  providers: [
    CreateOrUpdateUserService,
    FindOneUserByService,
    FindUserService,
    CreateRegisterUserService,
    CreateOrUpdateProfileService,
    CreateOrUpdateOrganizationService,
  ],
})
export class UserModule {}

import { CreateOrUpdateProfileService } from '../profile/services/mutations/create-or-update-profile.service';
import { FindOneUserByService } from './services/query/find-one-user-by.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/User';
import { FindUserService } from './services/query/find-user.service';
import { CreateOrUpdateUserService } from './services/mutations/create-or-update-user.service';
import { AuthUserController } from './controllers/auth/auth-user.controller';
import { CreateRegisterUserService } from './services/mutations/create-register-user.service';
import { Profile } from '../../models/Profile';
import { Organization } from '../../models/Organization';
import { CreateOrUpdateOrganizationService } from '../organization/services/mutations/create-or-update-organization.service';
import { CreateLoginUserService } from './services/mutations/create-login-user.service';
import { CreateOrUpdateResetPasswordService } from '../reset-password/services/mutations/create-or-update-reset-password.service';
import { ResetPassword } from '../../models/ResetPassword';
import { FindOneResetPasswordByService } from '../reset-password/services/query/find-one-reset-password-by.service';
import { ResetUpdatePasswordUserService } from './services/mutations/reset-update-password-user.service';
import { GetUsersController } from './controllers/user/get-users.controller';
import { GetOneUserController } from './controllers/user/get-one-user.controller';
import { UpdateContactController } from './controllers/user/update-user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Profile]),
    TypeOrmModule.forFeature([Organization]),
    TypeOrmModule.forFeature([ResetPassword]),
  ],
  controllers: [
    AuthUserController,
    GetUsersController,
    GetOneUserController,
    UpdateContactController,
  ],
  providers: [
    CreateOrUpdateUserService,
    FindOneUserByService,
    FindUserService,
    CreateRegisterUserService,
    CreateLoginUserService,
    CreateOrUpdateProfileService,
    CreateOrUpdateOrganizationService,
    CreateOrUpdateResetPasswordService,
    ResetUpdatePasswordUserService,
    FindOneResetPasswordByService,
  ],
})
export class UserModule {}

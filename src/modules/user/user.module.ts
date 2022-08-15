import { CreateOrUpdateProfileService } from '../profile/services/mutations/create-or-update-profile.service';
import { FindOneUserByService } from './services/query/find-one-user-by.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/User';
import { FindUserService } from './services/query/find-user.service';
import { CreateOrUpdateUserService } from './services/mutations/create-or-update-user.service';
import { AuthUserController } from './controllers/auth/auth-user.controller';
import { Profile } from '../../models/Profile';
import { Organization } from '../../models/Organization';
import { CreateOrUpdateOrganizationService } from '../organization/services/mutations/create-or-update-organization.service';
import {
  CreateLoginUser,
  CreateRegisterUser,
  ConfirmAccountTokenUser,
} from './services/use-cases';
import { CreateOrUpdateResetPasswordService } from '../reset-password/services/mutations/create-or-update-reset-password.service';
import { ResetPassword } from '../../models/ResetPassword';
import { FindOneResetPasswordByService } from '../reset-password/services/query/find-one-reset-password-by.service';
import { ResetUpdatePasswordUserService } from './services/mutations/reset-update-password-user.service';
import { GetUsersController } from './controllers/user/get-users.controller';
import { GetOneUserController } from './controllers/user/get-one-user.controller';
import { UpdateContactController } from './controllers/user/update-user.controller';
import { CheckUserService } from './middleware/check-user.service';
import { JwtAuthStrategy } from './middleware/jwt-auth.strategy';
import { FindOneApplicationTokenByService } from '../application-token/services/query/find-one-application-token-by.service';
import { ApplicationToken } from '../../models/ApplicationToken';
// import { LocalStrategy } from './services/middleware/auth-token-middleware';
import { ChangePasswordUser } from './services/use-cases/change-password-user';
import { UpdateOrganizationToUser } from './services/use-cases/update-organization-to-user';
import { CreateOrUpdateSubscribeService } from '../subscribe/services/mutations/create-or-update-subscribe.service';
import { Subscribe } from '../../models/Subscribe';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Profile]),
    TypeOrmModule.forFeature([Organization]),
    TypeOrmModule.forFeature([ResetPassword]),
    TypeOrmModule.forFeature([Subscribe]),
    TypeOrmModule.forFeature([ApplicationToken]),
  ],
  controllers: [
    AuthUserController,
    GetUsersController,
    GetOneUserController,
    UpdateContactController,
  ],
  providers: [
    /** Imports providers query */
    JwtAuthStrategy,
    FindUserService,
    FindOneUserByService,
    FindOneApplicationTokenByService,

    /** Imports providers mutations */
    CheckUserService,
    CreateOrUpdateUserService,
    CreateOrUpdateProfileService,
    CreateOrUpdateResetPasswordService,
    CreateOrUpdateOrganizationService,
    FindOneResetPasswordByService,
    ResetUpdatePasswordUserService,
    CreateOrUpdateSubscribeService,

    /** Imports providers use-cases */
    CreateLoginUser,
    ChangePasswordUser,
    CreateRegisterUser,
    ConfirmAccountTokenUser,
    UpdateOrganizationToUser,
  ],
})
export class UserModule {}

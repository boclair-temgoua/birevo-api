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
import { GetOneOrMultipleUsersController } from './controllers/user/get-one-or-multiple-users.controller';
import { UpdateUserController } from './controllers/user/update-user.controller';
import { CheckUserService } from './middleware/check-user.service';
import { JwtAuthStrategy } from './middleware/jwt-auth.strategy';
import { FindOneApplicationTokenByService } from '../application-token/services/query/find-one-application-token-by.service';
import { ApplicationToken } from '../../models/ApplicationToken';
import { ChangePasswordUser } from './services/use-cases/change-password-user';
import { UpdateOrganizationToUser } from './services/use-cases/update-organization-to-user';
import { CreateOrUpdateSubscribeService } from '../subscribe/services/mutations/create-or-update-subscribe.service';
import { Subscribe } from '../../models/Subscribe';
import { GetAuthorizationToSubscribe } from '../subscribe/services/use-cases/get-authorization-to-subscribe';
import { FindOneSubscribeByService } from '../subscribe/services/query/find-one-subscribe-by.service';
import { FindOneOrganizationByService } from '../organization/services/query/find-one-organization-by.service';
import { UpdateInformationToUser } from './services/use-cases/update-information-to-user';
import { FindOneProfileByService } from '../profile/services/query/find-one-profile-by.service';
import { FindOneCurrencyByService } from '../currency/services/query/find-one-currency-by.service';
import { Currency } from '../../models/Currency';
import { FindOneCountryByService } from '../country/services/query/find-one-country-by.service';
import { Country } from '../../models/Country';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Profile,
      Currency,
      Organization,
      ResetPassword,
      Subscribe,
      Country,
      ApplicationToken,
    ]),
  ],
  controllers: [
    AuthUserController,
    UpdateUserController,
    GetOneOrMultipleUsersController,
  ],
  providers: [
    /** Imports providers query */
    JwtAuthStrategy,
    FindUserService,
    FindOneUserByService,
    FindOneCurrencyByService,
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
    FindOneSubscribeByService,
    FindOneOrganizationByService,
    FindOneCountryByService,
    FindOneProfileByService,

    /** Imports providers use-cases */
    CreateLoginUser,
    ChangePasswordUser,
    CreateRegisterUser,
    ConfirmAccountTokenUser,
    UpdateOrganizationToUser,
    GetAuthorizationToSubscribe,
    UpdateInformationToUser,
  ],
})
export class UserModule {}

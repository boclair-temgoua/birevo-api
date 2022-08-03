import { FindOneUserByService } from '../query/find-one-user-by.service';
import { CreateOrUpdateUserService } from './create-or-update-user.service';
import { CreateOrUpdateProfileService } from '../../../profile/services/mutations/create-or-update-profile.service';
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { useCatch } from 'src/infrastructure/utils/use-catch';
import { CreateLoginUserDto } from '../../dto/create-login-user.dto';
import { CreateOrUpdateResetPasswordDto } from '../../../reset-password/dto/create-or-update-reset-password.dto';
import { CreateOrUpdateResetPasswordService } from '../../../reset-password/services/mutations/create-or-update-reset-password.service';
import { generateLongUUID } from '../../../../infrastructure/utils/commons/generate-long-uuid';

@Injectable()
export class CreateLoginUserService {
  constructor(
    private readonly findOneUserByService: FindOneUserByService,
    private readonly createOrUpdateResetPasswordService: CreateOrUpdateResetPasswordService,
  ) {}

  /** Create one login to the database. */
  async createOneLogin(options: CreateLoginUserDto): Promise<any> {
    const { email, password } = { ...options };

    const [_error, user] = await useCatch(
      this.findOneUserByService.findOneBy({ option2: { email } }),
    );
    if (_error) {
      throw new NotFoundException(_error);
    }
    if (!user)
      throw new HttpException(
        `Email ${email} already exists please change`,
        HttpStatus.NOT_FOUND,
      );
    if (!user?.checkIfPasswordMatch(password))
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);
    /** Fix create JWT token */

    return user;
  }

  /** Create one register to the database. */
  async createOneResetPassword(
    options: CreateOrUpdateResetPasswordDto,
  ): Promise<any> {
    const { email } = { ...options };

    const [_error, user] = await useCatch(
      this.findOneUserByService.findOneBy({ option2: { email } }),
    );
    if (_error) {
      throw new NotFoundException(_error);
    }
    if (!user)
      throw new HttpException(
        `Email ${email} already don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const [_errorSave, resetPassword] = await useCatch(
      this.createOrUpdateResetPasswordService.createOne({ email }),
    );
    if (_errorSave) {
      throw new NotFoundException(_errorSave);
    }
    /** Fix send mail to User */

    return resetPassword;
  }
}

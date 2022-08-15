import { FindOneUserByService } from '../query/find-one-user-by.service';
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { useCatch } from 'src/infrastructure/utils/use-catch';
import { CreateOrUpdateResetPasswordDto } from '../../../reset-password/dto/validation-reset-password.dto';
import { CreateOrUpdateResetPasswordService } from '../../../reset-password/services/mutations/create-or-update-reset-password.service';
import { FindOneResetPasswordByService } from '../../../reset-password/services/query/find-one-reset-password-by.service';
import { CreateOrUpdateUserService } from './create-or-update-user.service';
import {
  UpdateResetPasswordUserDto,
  TokenUserDto,
} from '../../dto/validation-user.dto';

@Injectable()
export class ResetUpdatePasswordUserService {
  constructor(
    private readonly findOneUserByService: FindOneUserByService,
    private readonly createOrUpdateUserService: CreateOrUpdateUserService,
    private readonly findOneResetPasswordByService: FindOneResetPasswordByService,
    private readonly createOrUpdateResetPasswordService: CreateOrUpdateResetPasswordService,
  ) {}

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

  /** Update one reset password to the database. */
  async updateOneResetPassword(
    options: UpdateResetPasswordUserDto & TokenUserDto,
  ): Promise<any> {
    const { password, token } = { ...options };

    const [_error, userResetPassword] = await useCatch(
      this.findOneResetPasswordByService.findOneBy({ option1: { token } }),
    );
    if (_error) {
      throw new NotFoundException(_error);
    }
    if (!userResetPassword)
      throw new HttpException(
        `Token not valid or expired. Please try again later`,
        HttpStatus.NOT_FOUND,
      );

    /** Find one user to reset password */
    const [_errorFU, user] = await useCatch(
      this.findOneUserByService.findOneBy({
        option2: { email: userResetPassword?.email },
      }),
    );
    if (_errorFU) {
      throw new NotFoundException(_errorFU);
    }
    /** Update info to  user */
    const [errorU, saveItem] = await useCatch(
      this.createOrUpdateUserService.updateOne(
        { option1: { userId: user?.id } },
        { password },
      ),
    );
    if (errorU) {
      throw new NotFoundException(errorU);
    }
    /** Update info to  reset password */
    const [errorURP, updateRPW] = await useCatch(
      this.createOrUpdateResetPasswordService.updateOne(
        { option1: { token } },
        { deletedAt: new Date() },
      ),
    );
    if (errorURP) {
      throw new NotFoundException(errorURP);
    }

    return saveItem;
  }
}

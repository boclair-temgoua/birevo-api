import {
  Controller,
  Post,
  NotFoundException,
  Body,
  Put,
  Param,
  Ip,
  Res,
} from '@nestjs/common';
import { reply } from '../../../../infrastructure/utils/reply';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateRegisterUserService } from '../../services/mutations/create-register-user.service';

import { CreateLoginUser } from '../../services/use-cases/create-login-user';
import { CreateOrUpdateResetPasswordDto } from '../../../reset-password/dto/validation-reset-password.dto';
import { ResetUpdatePasswordUserService } from '../../services/mutations/reset-update-password-user.service';
import {
  CreateRegisterUserDto,
  CreateLoginUserDto,
  UpdateResetPasswordUserDto,
  TokenResetPasswordUserDto,
} from '../../dto/validation-user.dto';

@Controller()
export class AuthUserController {
  constructor(
    private readonly createRegisterUserService: CreateRegisterUserService,
    private readonly createLoginUser: CreateLoginUser,
    private readonly resetUpdatePasswordUserService: ResetUpdatePasswordUserService,
  ) {}

  /** Register new user */
  @Post(`/register`)
  async createOneRegister(
    @Res() res,
    @Body() createRegisterUserDto: CreateRegisterUserDto,
  ) {
    const [errors, results] = await useCatch(
      this.createRegisterUserService.createOneRegister({
        ...createRegisterUserDto,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  /** Login user */
  @Post(`/login`)
  async createOneLogin(
    @Res() res,
    @Ip() ip: string,
    @Body() createLoginUserDto: CreateLoginUserDto,
  ) {
    const [errors, results] = await useCatch(
      this.createLoginUser.createOneLogin({ ...createLoginUserDto }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    console.log(`ip ====>`, ip);
    return reply({ res, results });
  }

  /** Reset password */
  @Post(`/password/reset`)
  async createOneResetPassword(
    @Res() res,
    @Body() createOrUpdateResetPasswordDto: CreateOrUpdateResetPasswordDto,
  ) {
    const [errors, results] = await useCatch(
      this.resetUpdatePasswordUserService.createOneResetPassword({
        ...createOrUpdateResetPasswordDto,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  /** Update reset password */
  @Put(`/password/update/:token`)
  async updateOneResetPassword(
    @Res() res,
    @Body() updateResetPasswordUserDto: UpdateResetPasswordUserDto,
    @Param() tokenResetPasswordUserDto: TokenResetPasswordUserDto,
  ) {
    const [errors, results] = await useCatch(
      this.resetUpdatePasswordUserService.updateOneResetPassword({
        ...updateResetPasswordUserDto,
        ...tokenResetPasswordUserDto,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }
}

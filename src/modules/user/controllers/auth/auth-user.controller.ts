import {
  Controller,
  Post,
  Response,
  NotFoundException,
  Body,
  Put,
  Param,
} from '@nestjs/common';
import { reply } from '../../../../infrastructure/utils/reply';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateRegisterUserService } from '../../services/mutations/create-register-user.service';
import { CreateRegisterUserDto } from '../../dto/create-register-user.dto';
import { CreateLoginUserDto } from '../../dto/create-login-user.dto';
import { CreateLoginUserService } from '../../services/mutations/create-login-user.service';
import { CreateOrUpdateResetPasswordDto } from '../../../reset-password/dto/create-or-update-reset-password.dto';
import { ResetUpdatePasswordUserService } from '../../services/mutations/reset-update-password-user.service';
import {
  TokenResetPasswordUserDto,
  UpdateResetPasswordUserDto,
} from '../../dto/create-or-update-user.dto';

@Controller()
export class AuthUserController {
  constructor(
    private readonly createRegisterUserService: CreateRegisterUserService,
    private readonly createLoginUserService: CreateLoginUserService,
    private readonly resetUpdatePasswordUserService: ResetUpdatePasswordUserService,
  ) {}

  /** Register new user */
  @Post(`/register`)
  async createOneRegister(
    @Response() res: any,
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
    @Response() res: any,
    @Body() createLoginUserDto: CreateLoginUserDto,
  ) {
    const [errors, results] = await useCatch(
      this.createLoginUserService.createOneLogin({ ...createLoginUserDto }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  /** Reset password */
  @Post(`/password/reset`)
  async createOneResetPassword(
    @Response() res: any,
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
    @Response() res: any,
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

import { CreateOrUpdateProfileService } from '../../../profile/services/mutations/create-or-update-profile.service';
import {
  Controller,
  Post,
  Response,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { reply } from '../../../../infrastructure/utils/reply';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateRegisterUserService } from '../../services/mutations/create-register-user.service';
import { CreateRegisterUserDto } from '../../dto/create-register-user.dto';
import { CreateLoginUserDto } from '../../dto/create-login-user.dto';
import { CreateLoginUserService } from '../../services/mutations/create-login-user.service';
import { CreateOrUpdateResetPasswordDto } from '../../../reset-password/dto/create-or-update-reset-password.dto';

@Controller()
export class AuthUserController {
  constructor(
    private readonly createRegisterUserService: CreateRegisterUserService,
    private readonly createLoginUserService: CreateLoginUserService,
  ) {}

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

  @Post(`/password/reset`)
  async createOneResetPassword(
    @Response() res: any,
    @Body() createOrUpdateResetPasswordDto: CreateOrUpdateResetPasswordDto,
  ) {
    const [errors, results] = await useCatch(
      this.createLoginUserService.createOneResetPassword({
        ...createOrUpdateResetPasswordDto,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }
}

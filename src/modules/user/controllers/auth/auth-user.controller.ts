import {
  Controller,
  Post,
  NotFoundException,
  Body,
  Put,
  Param,
  Ip,
  Res,
  Query,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { reply } from '../../../../infrastructure/utils/reply';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateRegisterUser } from '../../services/use-cases';

import { CreateLoginUser } from '../../services/use-cases/create-login-user';
import { CreateOrUpdateResetPasswordDto } from '../../../reset-password/dto/validation-reset-password.dto';
import { ResetUpdatePasswordUserService } from '../../services/mutations/reset-update-password-user.service';
import {
  CreateRegisterUserDto,
  CreateLoginUserDto,
  UpdateResetPasswordUserDto,
  TokenUserDto,
} from '../../dto/validation-user.dto';
import { ConfirmAccountTokenUser } from '../../services/use-cases/confirm-account-token-user';
import { ChangePasswordUser } from '../../services/use-cases/change-password-user';
import { JwtAuthGuard } from '../../middleware/jwt-auth.guard';
import { UpdateChangePasswordUserDto } from '../../dto/validation-user.dto';

@Controller()
export class AuthUserController {
  constructor(
    private readonly createRegisterUser: CreateRegisterUser,
    private readonly createLoginUser: CreateLoginUser,
    private readonly changePasswordUser: ChangePasswordUser,
    private readonly confirmAccountTokenUser: ConfirmAccountTokenUser,
    private readonly resetUpdatePasswordUserService: ResetUpdatePasswordUserService,
  ) {}

  /** Register new user */
  @Post(`/register`)
  async createOneRegister(
    @Res() res,
    @Body() createRegisterUserDto: CreateRegisterUserDto,
  ) {
    const [errors, results] = await useCatch(
      this.createRegisterUser.execute({
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
      this.createLoginUser.execute({ ...createLoginUserDto, ip }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
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
    @Param() tokenUserDto: TokenUserDto,
  ) {
    const [errors, results] = await useCatch(
      this.resetUpdatePasswordUserService.updateOneResetPassword({
        ...updateResetPasswordUserDto,
        ...tokenUserDto,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  /** Confirm account*/
  @Get(`/confirm-account`)
  async confirmAccount(@Res() res, @Query() tokenUserDto: TokenUserDto) {
    const [errors, results] = await useCatch(
      this.confirmAccountTokenUser.execute({ ...tokenUserDto }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  /** Change password account*/
  @Put(`/change-password`)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Res() res,
    @Req() req,
    @Body() updateChangePasswordUserDto: UpdateChangePasswordUserDto,
  ) {
    const { user } = req;
    const userId = req?.user?.id;
    const [errors, results] = await useCatch(
      this.changePasswordUser.execute({
        ...updateChangePasswordUserDto,
        userId,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }
}

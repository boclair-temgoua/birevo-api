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
  Headers,
  Req,
} from '@nestjs/common';
import { reply } from '../../../../infrastructure/utils/reply';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateRegisterUser } from '../../services/use-cases';
import * as amqplib from 'amqplib';
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
import { configurations } from '../../../../infrastructure/configurations/index';
import { authPasswordResetJob } from '../../jobs/auth-login-and-register-job';
import { getIpRequest } from '../../../../infrastructure/utils/commons/get-ip-request';

@Controller()
export class AuthUserController {
  constructor(
    private readonly createRegisterUser: CreateRegisterUser,
    private readonly createLoginUser: CreateLoginUser,
    private readonly confirmAccountTokenUser: ConfirmAccountTokenUser,
    private readonly resetUpdatePasswordUserService: ResetUpdatePasswordUserService,
  ) {}

  /** Register new user */
  @Post(`/register`)
  async createOneRegister(
    @Res() res,
    @Req() req,
    @Body() createRegisterUserDto: CreateRegisterUserDto,
    @Headers('User-Agent') userAgent: string,
  ) {
    const [errors, results] = await useCatch(
      this.createRegisterUser.execute({
        ...createRegisterUserDto,
        ipLocation: getIpRequest(req),
        userAgent,
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
    @Req() req,
    @Body() createLoginUserDto: CreateLoginUserDto,
  ) {
    const [errors, results] = await useCatch(
      this.createLoginUser.execute({
        ...createLoginUserDto,
        ipLocation: getIpRequest(req),
      }),
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
    const [errors, result] = await useCatch(
      this.resetUpdatePasswordUserService.createOneResetPassword({
        ...createOrUpdateResetPasswordDto,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    /** Send information to Job */
    const queue = 'user-password-reset';
    const connect = await amqplib.connect(
      configurations.implementations.amqp.link,
    );
    const channel = await connect.createChannel();
    await channel.assertQueue(queue, { durable: false });
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(result)));
    await authPasswordResetJob({ channel, queue });
    /** End send information to Job */

    return reply({ res, results: result });
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
}

import { FindOneUserByService } from '../query/find-one-user-by.service';
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as amqplib from 'amqplib';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateLoginUserDto } from '../../dto/validation-user.dto';
import { sign, verify } from 'jsonwebtoken';
import { JwtPayloadType } from '../../types';
import { CheckUserService } from '../../middleware/check-user.service';
import { configurations } from '../../../../infrastructure/configurations/index';
import { authLoginJob } from '../../jobs/auth-login-and-register-job';

@Injectable()
export class CreateLoginUser {
  constructor(
    private readonly findOneUserByService: FindOneUserByService,
    private readonly checkUserService: CheckUserService,
  ) {}

  /** Create one login to the database. */
  async execute(options: CreateLoginUserDto): Promise<any> {
    const { email, password, ip } = { ...options };

    const [_error, user] = await useCatch(
      this.findOneUserByService.findOneBy({ option2: { email } }),
    );
    if (_error) {
      throw new NotFoundException(_error);
    }
    if (!user?.checkIfPasswordMatch(password))
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);
    /** Fix create JWT token */

    const jwtPayload: JwtPayloadType = {
      id: user.id,
      uuid: user.uuid,
      profileId: user.profileId,
      lastName: user?.profile?.lastName,
      firstName: user?.profile?.firstName,
      organizationId: user.organizationInUtilizationId,
    };

    const refreshToken = await this.checkUserService.createJwtTokens(
      jwtPayload,
    );

    const queue = 'user-login';
    const connect = await amqplib.connect(
      configurations.implementations.amqp.link,
    );
    const channel = await connect.createChannel();
    await channel.assertQueue(queue, { durable: false });
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(user)));
    await authLoginJob({ channel, queue });

    return 'Bearer ' + refreshToken;
  }
}

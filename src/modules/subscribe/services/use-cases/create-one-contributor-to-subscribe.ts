import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import {
  SubscribeRequestDto,
  getOneRoleByName,
} from '../../dto/validation-subscribe.dto';
import * as amqplib from 'amqplib';
import { GetAuthorizationToSubscribe } from './get-authorization-to-subscribe';
import { CreateOrUpdateSubscribeService } from '../mutations/create-or-update-subscribe.service';
import { FindOneUserByService } from '../../../user/services/query/find-one-user-by.service';
import { configurations } from '../../../../infrastructure/configurations/index';
import { subscribeJob } from '../../jobs/subscribe-job';

@Injectable()
export class CreateOneContributorToSubscribe {
  constructor(
    private readonly findOneUserByService: FindOneUserByService,
    private readonly createOrUpdateSubscribeService: CreateOrUpdateSubscribeService,
    private readonly getAuthorizationToSubscribe: GetAuthorizationToSubscribe,
  ) {}

  /** Get one Authorization to the database. */
  async execute(options: SubscribeRequestDto): Promise<any> {
    const { userId, organizationId, contributorId, type } = { ...options };

    const [__errorOr, isExistedResult] = await useCatch(
      this.getAuthorizationToSubscribe.execute({
        organizationId,
        userId: contributorId,
        type,
      }),
    );
    if (__errorOr) {
      throw new NotFoundException(__errorOr);
    }

    // Find if organization exist
    if (!isExistedResult?.subscribeOrganization) {
      const [__error, contributor] = await useCatch(
        this.createOrUpdateSubscribeService.createOne({
          subscribableType: type,
          subscribableId: isExistedResult?.organization?.id,
          organizationId,
          userCreatedId: userId,
          userId: contributorId,
          roleId: getOneRoleByName('MODERATOR'),
        }),
      );
      if (__error) {
        throw new NotFoundException(__error);
      }
      // Send notification
      const [_errorId, userGuest] = await useCatch(
        this.findOneUserByService.findOneBy({
          option1: { userId },
        }),
      );
      if (_errorId) {
        throw new NotFoundException(_errorId);
      }

      const [_errorIv, userContributor] = await useCatch(
        this.findOneUserByService.findOneBy({
          option1: { userId: contributor?.userId },
        }),
      );
      if (_errorIv) {
        throw new NotFoundException(_errorIv);
      }

      const user = { userGuest, userContributor };
      const queue = 'user-subscribe';
      const connect = await amqplib.connect(
        configurations.implementations.amqp.link,
      );
      const channel = await connect.createChannel();
      await channel.assertQueue(queue, { durable: false });
      await channel.sendToQueue(queue, Buffer.from(JSON.stringify(user)));
      await subscribeJob({ channel, queue });
    }

    return isExistedResult;
  }
}

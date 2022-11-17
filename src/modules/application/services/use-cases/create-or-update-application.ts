import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as amqplib from 'amqplib';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateOrUpdateApplicationService } from '../mutations/create-or-update-application.service';
import { CreateOrUpdateApplicationDto } from '../../dto/validation-application.dto';
import { CreateOrUpdateApplicationTokenService } from '../../../application-token/services/mutations/create-or-update-application-token.service';
import { FindOneApplicationByService } from '../query/find-one-application-by.service';
import { configurations } from '../../../../infrastructure/configurations/index';
import { newApplicationJob } from '../../jobs/application-job';

@Injectable()
export class CreateOrUpdateApplication {
  constructor(
    private readonly createOrUpdateApplicationService: CreateOrUpdateApplicationService,
    private readonly findOneApplicationByService: FindOneApplicationByService,
    private readonly createOrUpdateApplicationTokenService: CreateOrUpdateApplicationTokenService,
  ) {}

  /** Create one Application Or Update to the database. */
  async createOrUpdate(options: CreateOrUpdateApplicationDto): Promise<any> {
    const { application_uuid, name, statusOnline, user } = { ...options };

    if (application_uuid) {
      const [error, findApplication] = await useCatch(
        this.findOneApplicationByService.findOneBy({
          option1: { application_uuid },
        }),
      );
      if (error) {
        throw new NotFoundException(error);
      }
      if (!findApplication)
        throw new HttpException(
          `Application invalid or expired`,
          HttpStatus.NOT_FOUND,
        );
      const [errorUpdate, update] = await useCatch(
        this.createOrUpdateApplicationService.updateOne(
          { option1: { application_uuid } },
          { name, statusOnline },
        ),
      );
      if (errorUpdate) {
        throw new NotFoundException(errorUpdate);
      }

      return update;
    } else {
      const [_errorSave, application] = await useCatch(
        this.createOrUpdateApplicationService.createOne({
          name,
          statusOnline,
          userId: user?.organizationInUtilization?.userId,
          userCreatedId: user?.id,
        }),
      );
      if (_errorSave) {
        throw new NotFoundException(_errorSave);
      }
      const [__errorSave, applicationToken] = await useCatch(
        this.createOrUpdateApplicationTokenService.createOne({
          applicationId: application?.id,
          userId: application?.userId,
          userCreatedId: application?.userCreatedId,
          organizationId: user?.organizationInUtilization?.id,
        }),
      );
      if (__errorSave) {
        throw new NotFoundException(__errorSave);
      }

      const queue = 'user-application';
      const connect = await amqplib.connect(
        configurations.implementations.amqp.link,
      );
      const payload = { ...application, email: user?.email };
      const channel = await connect.createChannel();
      await channel.assertQueue(queue, { durable: false });
      await channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)));
      await newApplicationJob({ channel, queue });

      return { application, applicationToken };
    }
  }

  /** Delete one Application to the database. */
  async deleteOne(options: { application_uuid: string }): Promise<any> {
    const { application_uuid } = { ...options };
    const [error, findApplication] = await useCatch(
      this.findOneApplicationByService.findOneBy({
        option1: { application_uuid },
      }),
    );
    if (error) {
      throw new NotFoundException(error);
    }
    if (!findApplication)
      throw new HttpException(
        `Application invalid or expired`,
        HttpStatus.NOT_FOUND,
      );

    /** Delete all application Token */
    Promise.all([
      findApplication?.applicationTokens.map(async (item) => {
        const [_error, _] = await useCatch(
          this.createOrUpdateApplicationTokenService.updateOne(
            { option1: { application_token_uuid: item?.uuid } },
            { deletedAt: new Date() },
          ),
        );
        if (_error) {
          throw new NotFoundException(_error);
        }
      }),
    ]);

    /** Delete one application */
    const [_error, _] = await useCatch(
      this.createOrUpdateApplicationService.updateOne(
        { option1: { application_uuid } },
        { deletedAt: new Date() },
      ),
    );
    if (_error) {
      throw new NotFoundException(_error);
    }

    return findApplication;
  }
}

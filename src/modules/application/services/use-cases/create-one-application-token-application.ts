import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { ApplicationUuidDto } from '../../dto/validation-application.dto';
import { CreateOrUpdateApplicationTokenService } from '../../../application-token/services/mutations/create-or-update-application-token.service';
import { FindOneApplicationByService } from '../query/find-one-application-by.service';

@Injectable()
export class CreateOneApplicationTokenApplication {
  constructor(
    private readonly findOneApplicationByService: FindOneApplicationByService,
    private readonly createOrUpdateApplicationTokenService: CreateOrUpdateApplicationTokenService,
  ) {}

  /** Create one Application to the database. */
  async createOne(options: ApplicationUuidDto): Promise<any> {
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
    const [__errorSave, _applicationToken] = await useCatch(
      this.createOrUpdateApplicationTokenService.createOne({
        applicationId: findApplication?.id,
        userId: findApplication?.userId,
        organizationId: 1,
        userCreatedId: findApplication?.userCreatedId,
      }),
    );
    if (__errorSave) {
      throw new NotFoundException(__errorSave);
    }
    return findApplication;
  }
}

import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateOrUpdateActivityDto } from '../../dto/validation-activity.dto';
import { CreateOrUpdateActivityService } from '../mutations/create-or-update-activity.service';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
@Injectable()
export class CreateOrUpdateActivity {
  constructor(
    private readonly createOrUpdateActivityService: CreateOrUpdateActivityService,
  ) {}

  async execute(options: CreateOrUpdateActivityDto): Promise<any> {
    const {
      activityAbleType,
      activityAbleId,
      action,
      ipLocation,
      browser,
      os,
      platform,
      source,
      applicationId,
      userCreatedId,
    } = {
      ...options,
    };

    const dataSave = {
      activityAbleType,
      activityAbleId,
      action,
      ipLocation,
      browser,
      os,
      platform,
      source,
      applicationId,
      userCreatedId,
      view: 1,
    };

    const [errorSave, activity] = await useCatch(
      this.createOrUpdateActivityService.createOne({ ...dataSave }),
      // action === 'USED' || 'DELETE'
      //   ? this.createOrUpdateActivityService.createOne({
      //       ...dataSave,
      //       usage: 1,
      //     })
      //   : this.createOrUpdateActivityService.createOne({ ...dataSave }),
    );
    if (errorSave) {
      throw new NotFoundException(errorSave);
    }

    return activity;
  }
}

import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateOrUpdateActivityDto } from '../../dto/validation-activity.dto';
import { CreateOrUpdateActivityService } from '../mutations/create-or-update-activity.service';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { getOneLocationIpApi } from '../../../integrations/ip-api/api/index';
import { geoIpRequest } from '../../../../infrastructure/utils/commons/geo-ip-request';
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
      platform,
      applicationId,
      organizationId,
      userCreatedId,
    } = {
      ...options,
    };

    const geoLocation = geoIpRequest(ipLocation);
    const dataSave = {
      activityAbleType,
      activityAbleId,
      action,
      ipLocation,
      browser,
      city: geoLocation?.city,
      platform,
      countryCode: geoLocation?.country,
      applicationId,
      organizationId,
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

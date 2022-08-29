import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { Activity } from '../../../../models/Activity';
import { generateUUID } from '../../../../infrastructure/utils/commons/generate-uuid';
import { CreateActivityOptions } from '../../types';
import { getRandomElement } from '../../../../infrastructure/utils/array/get-random-element';
import { colorsArrays } from '../../../../infrastructure/utils/commons/get-colors';

@Injectable()
export class CreateOrUpdateActivityService {
  constructor(
    @InjectRepository(Activity)
    private driver: Repository<Activity>,
  ) {}

  /** Create one Activity to the database. */
  async createOne(options: CreateActivityOptions): Promise<Activity> {
    const {
      activityAbleType,
      activityAbleId,
      action,
      ipLocation,
      browser,
      country,
      platform,
      countryCode,
      organizationId,
      city,
      applicationId,
      userCreatedId,
      view,
      usage,
    } = {
      ...options,
    };

    const activity = new Activity();
    activity.uuid = generateUUID();
    activity.activityAbleType = activityAbleType;
    activity.activityAbleId = activityAbleId;
    activity.action = action;
    activity.ipLocation = ipLocation;
    activity.platform = platform;
    activity.city = city;
    activity.color = getRandomElement(colorsArrays);
    activity.countryCode = countryCode;
    activity.country = country;
    activity.view = view;
    activity.usage = usage;
    activity.organizationId = organizationId;
    activity.applicationId = applicationId;
    activity.userCreatedId = userCreatedId;
    activity.browser = browser;

    const query = this.driver.save(activity);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }
}

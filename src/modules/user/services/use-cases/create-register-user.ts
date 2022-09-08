import { FindOneUserByService } from '../query/find-one-user-by.service';
import { CreateOrUpdateUserService } from '../mutations/create-or-update-user.service';
import { CreateOrUpdateProfileService } from '../../../profile/services/mutations/create-or-update-profile.service';
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as amqplib from 'amqplib';
import { CreateRegisterUserDto } from '../../dto/validation-user.dto';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateOrUpdateOrganizationService } from '../../../organization/services/mutations/create-or-update-organization.service';
import { configurations } from '../../../../infrastructure/configurations';
import { authRegisterJob } from '../../jobs/auth-login-and-register-job';
import { CreateOrUpdateSubscribeService } from '../../../subscribe/services/mutations/create-or-update-subscribe.service';
import { FindOneCurrencyByService } from '../../../currency/services/query/find-one-currency-by.service';
import { getOneLocationIpApi } from '../../../integrations/ip-api/api/index';
import { FindOneCountryByService } from '../../../country/services/query/find-one-country-by.service';

@Injectable()
export class CreateRegisterUser {
  constructor(
    private readonly findOneUserByService: FindOneUserByService,
    private readonly findOneCountryByService: FindOneCountryByService,
    private readonly findOneCurrencyByService: FindOneCurrencyByService,
    private readonly createOrUpdateUserService: CreateOrUpdateUserService,
    private readonly createOrUpdateProfileService: CreateOrUpdateProfileService,
    private readonly createOrUpdateSubscribeService: CreateOrUpdateSubscribeService,
    private readonly createOrUpdateOrganizationService: CreateOrUpdateOrganizationService,
  ) {}

  /** Create one register to the database. */
  async execute(options: CreateRegisterUserDto): Promise<any> {
    const { email, password, fullName, ipLocation, couponCode, userAgent } = {
      ...options,
    };

    /** Find currency */
    const findIpLocation = await getOneLocationIpApi({ ipLocation });
    /** Find one currency */
    const [_errorC, currency] = await useCatch(
      this.findOneCurrencyByService.findOneBy({
        option2: { code: findIpLocation?.currency },
      }),
    );
    if (_errorC) {
      throw new NotFoundException(_errorC);
    }

    /** Find one country */
    const [_errorCt, country] = await useCatch(
      this.findOneCountryByService.findOneBy({
        option2: { code: findIpLocation?.countryCode },
      }),
    );
    if (_errorCt) {
      throw new NotFoundException(_errorCt);
    }

    const [_error, user] = await useCatch(
      this.findOneUserByService.findOneBy({ option2: { email } }),
    );
    if (_error) {
      throw new NotFoundException(_error);
    }
    if (user)
      throw new HttpException(
        `Email ${email} already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    /** Create Profile */
    const [errorP, profile] = await useCatch(
      this.createOrUpdateProfileService.createOne({
        fullName,
        countryId: country?.id || 38,
        currencyId: currency?.id || 1,
      }),
    );
    if (errorP) {
      throw new NotFoundException(errorP);
    }

    /** Create Organization */
    const [_errorOr, organization] = await useCatch(
      this.createOrUpdateOrganizationService.createOne({
        name: `${fullName}`,
      }),
    );
    if (_errorOr) {
      throw new NotFoundException(_errorOr);
    }

    /** Save user */
    const [errorU, saveItem] = await useCatch(
      this.createOrUpdateUserService.createOne({
        email,
        password,
        profileId: profile?.id,
        organizationInUtilizationId: organization?.id,
      }),
    );
    if (errorU) {
      throw new NotFoundException(errorU);
    }

    /** Create Subscribe */
    const [__SB, _subscribe] = await useCatch(
      this.createOrUpdateSubscribeService.createOne({
        subscribableType: 'ORGANIZATION',
        subscribableId: organization?.id,
        organizationId: organization?.id,
        userCreatedId: saveItem?.id,
        userId: saveItem?.id,
        roleId: 1,
      }),
    );
    if (__SB) {
      throw new NotFoundException(__SB);
    }

    /** Update Organization */
    const [__errorOr, _organization] = await useCatch(
      this.createOrUpdateOrganizationService.updateOne(
        { option1: { organizationId: organization?.id } },
        { userId: saveItem?.id },
      ),
    );
    if (__errorOr) {
      throw new NotFoundException(__errorOr);
    }

    const queue = 'user-register';
    const connect = await amqplib.connect(
      configurations.implementations.amqp.link,
    );
    const channel = await connect.createChannel();
    await channel.assertQueue(queue, { durable: false });
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(saveItem)));
    await authRegisterJob({ channel, queue });

    return saveItem;
  }
}

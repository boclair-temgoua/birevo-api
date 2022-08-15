import { Injectable, NotFoundException } from '@nestjs/common';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { FindOneSubscribeByService } from '../query/find-one-subscribe-by.service';
import { FindOneOrganizationByService } from '../../../organization/services/query/find-one-organization-by.service';
import { SubscribeRequestDto } from '../../dto/validation-subscribe.dto';

@Injectable()
export class GetAuthorizationToSubscribe {
  constructor(
    private readonly findOneSubscribeByService: FindOneSubscribeByService,
    private readonly findOneOrganizationByService: FindOneOrganizationByService,
  ) {}

  /** Get one Authorization to the database. */
  async execute(options: SubscribeRequestDto): Promise<any> {
    const { userId, organizationId, type } = { ...options };

    if (organizationId) {
      const [__errorOr, organization] = await useCatch(
        this.findOneOrganizationByService.findOneBy({
          option1: { organizationId },
        }),
      );
      if (__errorOr) {
        throw new NotFoundException(__errorOr);
      }

      const [__errorSub, subscribeOrganization] = await useCatch(
        this.findOneSubscribeByService.findOneBy({
          option1: {
            userId,
            organizationId,
            subscribableType: type,
            subscribableId: organization.id,
          },
        }),
      );
      if (__errorSub) {
        throw new NotFoundException(__errorSub);
      }
      return { organization, subscribeOrganization };
    }

    return null;
  }
}

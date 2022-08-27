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
import { GetAuthorizationToSubscribe } from './get-authorization-to-subscribe';
import { CreateOrUpdateSubscribeService } from '../mutations/create-or-update-subscribe.service';

@Injectable()
export class CreateOneContributorToSubscribe {
  constructor(
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
      const [__error, __result] = await useCatch(
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
    }

    return isExistedResult;
  }
}

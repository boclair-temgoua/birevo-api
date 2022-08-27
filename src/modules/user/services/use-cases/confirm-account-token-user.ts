import { FindOneUserByService } from '../query/find-one-user-by.service';
import { CreateOrUpdateUserService } from '../mutations/create-or-update-user.service';
import { CreateOrUpdateProfileService } from '../../../profile/services/mutations/create-or-update-profile.service';
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TokenUserDto } from '../../dto/validation-user.dto';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateOrUpdateOrganizationService } from '../../../organization/services/mutations/create-or-update-organization.service';
import { configurations } from '../../../../infrastructure/configurations';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ConfirmAccountTokenUser {
  constructor(
    private readonly findOneUserByService: FindOneUserByService,
    private readonly createOrUpdateUserService: CreateOrUpdateUserService,
  ) {}

  /** Confirm account token to the database. */
  async execute(options: TokenUserDto): Promise<any> {
    const { token } = { ...options };

    const [_error, user] = await useCatch(
      this.findOneUserByService.findOneBy({ option5: { token } }),
    );
    if (_error) {
      throw new NotFoundException(_error);
    }
    if (!user) throw new UnauthorizedException();

    /** Update user */
    const [errorU, updateItem] = await useCatch(
      this.createOrUpdateUserService.updateOne(
        { option1: { userId: user?.id } },
        { token, confirmedAt: new Date() },
      ),
    );
    if (errorU) {
      throw new NotFoundException(errorU);
    }

    return { id: user?.id, uuid: user?.uuid, confirmedAt: user?.confirmedAt };
  }
}

import { FindOneUserByService } from '../query/find-one-user-by.service';
import { CreateOrUpdateUserService } from './create-or-update-user.service';
import { CreateOrUpdateProfileService } from '../../../profile/services/mutations/create-or-update-profile.service';
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateRegisterUserDto } from '../../dto/validation-user.dto';
import { useCatch } from 'src/infrastructure/utils/use-catch';
import { CreateOrUpdateOrganizationService } from '../../../organization/services/mutations/create-or-update-organization.service';

@Injectable()
export class CreateRegisterUserService {
  constructor(
    private readonly findOneUserByService: FindOneUserByService,
    private readonly createOrUpdateUserService: CreateOrUpdateUserService,
    private readonly createOrUpdateProfileService: CreateOrUpdateProfileService,
    private readonly createOrUpdateOrganizationService: CreateOrUpdateOrganizationService,
  ) {}

  /** Create one register to the database. */
  async createOneRegister(options: CreateRegisterUserDto): Promise<any> {
    const { email, password, lastName, firstName } = { ...options };

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
        firstName,
        lastName,
      }),
    );
    if (errorP) {
      throw new NotFoundException(errorP);
    }

    /** Create Organization */
    const [_errorOr, organization] = await useCatch(
      this.createOrUpdateOrganizationService.createOne({
        name: `${firstName} ${lastName}`,
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

    return saveItem;
  }
}

import { FindOneUserByService } from '../query/find-one-user-by.service';
import { CreateOrUpdateUserService } from '../mutations/create-or-update-user.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateInfoUserDto } from '../../dto/validation-user.dto';
import { useCatch } from '../../../../infrastructure/utils/use-catch';

@Injectable()
export class UpdateOrganizationToUser {
  constructor(
    private readonly findOneUserByService: FindOneUserByService,
    private readonly createOrUpdateUserService: CreateOrUpdateUserService,
  ) {}

  /** Confirm account token to the database. */
  async updateOrganization(options: UpdateInfoUserDto): Promise<any> {
    const { user, organizationId } = { ...options };

    /** Update user */
    const [errorU, updateItem] = await useCatch(
      this.createOrUpdateUserService.updateOne(
        { option1: { userId: user?.id } },
        { organizationInUtilizationId: organizationId },
      ),
    );
    if (errorU) {
      throw new NotFoundException(errorU);
    }

    return { id: user?.id, uuid: user?.uuid };
  }
}

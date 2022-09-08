import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { useCatch } from '../../../../infrastructure/utils/use-catch';

import { CreateStripeBullingDto } from '../../dto/validation-bulling.dto';
import { FindOneUserByService } from '../../../user/services/query/find-one-user-by.service';
import { CreateOrUpdateUserService } from '../../../user/services/mutations/create-or-update-user.service';

@Injectable()
export class UpdateUserAfterBilling {
  constructor(
    private readonly createOrUpdateUserService: CreateOrUpdateUserService,
    private readonly findOneUserByService: FindOneUserByService,
  ) {}

  /** Update user */
  async execute(options: { userInfoId: number }): Promise<any> {
    const { userInfoId } = { ...options };
    /** Find user */
    const [_errorFu, findUser] = await useCatch(
      this.findOneUserByService.findOneInfoBy({
        option1: { userId: userInfoId },
      }),
    );
    if (_errorFu) {
      throw new NotFoundException(_errorFu);
    }
    /** Check and update user */
    if (findUser?.balance?.total >= 0) {
      /** Save Amount */
      const [errorUpdateUser, updateUser] = await useCatch(
        this.createOrUpdateUserService.updateOne(
          { option1: { userId: findUser?.id } },
          { requiresPayment: false },
        ),
      );
      if (errorUpdateUser) {
        throw new NotFoundException(errorUpdateUser);
      }
    }

    return findUser;
  }
}

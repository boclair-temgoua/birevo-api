import { FindOneUserByService } from '../query/find-one-user-by.service';
import { CreateOrUpdateUserService } from '../mutations/create-or-update-user.service';
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  UpdateInfoUserDto,
  UpdateEmailUserDto,
} from '../../dto/validation-user.dto';
import { useCatch } from '../../../../infrastructure/utils/use-catch';

@Injectable()
export class UpdateInformationToUser {
  constructor(
    private readonly findOneUserByService: FindOneUserByService,
    private readonly createOrUpdateUserService: CreateOrUpdateUserService,
  ) {}

  /** Update email user to database. */
  async updateEmailToUser(options: UpdateEmailUserDto): Promise<any> {
    const { user, newEmail, passwordConfirm } = { ...options };

    const [errorFU, isOneUserExist] = await useCatch(
      this.findOneUserByService.findOneBy({ option2: { email: newEmail } }),
    );
    if (errorFU) {
      throw new NotFoundException(errorFU);
    }

    if (isOneUserExist && isOneUserExist?.email !== user?.email)
      throw new HttpException(
        `Email: ${newEmail} already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    if (!user?.checkIfPasswordMatch(passwordConfirm))
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

    /** Update user */
    const [errorU, updateItem] = await useCatch(
      this.createOrUpdateUserService.updateOne(
        { option1: { userId: user?.id } },
        { email: newEmail },
      ),
    );
    if (errorU) {
      throw new NotFoundException(errorU);
    }

    return { id: user?.id, uuid: user?.uuid };
  }
}

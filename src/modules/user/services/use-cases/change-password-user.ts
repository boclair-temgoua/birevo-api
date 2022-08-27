import { FindOneUserByService } from '../query/find-one-user-by.service';
import { CreateOrUpdateUserService } from '../mutations/create-or-update-user.service';
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { UnauthorizedException } from '@nestjs/common';
import { UpdateChangePasswordUserDto } from '../../dto/validation-user.dto';

@Injectable()
export class ChangePasswordUser {
  constructor(
    private readonly findOneUserByService: FindOneUserByService,
    private readonly createOrUpdateUserService: CreateOrUpdateUserService,
  ) {}

  /** Confirm account token to the database. */
  async execute(options: UpdateChangePasswordUserDto): Promise<any> {
    const { password, newPassword, userId } = { ...options };

    const [_error, user] = await useCatch(
      this.findOneUserByService.findOneBy({ option1: { userId } }),
    );
    if (_error) {
      throw new NotFoundException(_error);
    }
    if (!user) throw new UnauthorizedException();

    if (!user?.checkIfPasswordMatch(password))
      throw new HttpException(`Invalid password`, HttpStatus.NOT_FOUND);

    /** Update user */
    const [errorU, updateItem] = await useCatch(
      this.createOrUpdateUserService.updateOne(
        { option1: { userId: user?.id } },
        { password: newPassword },
      ),
    );
    if (errorU) {
      throw new NotFoundException(errorU);
    }

    return { id: user?.id, uuid: user?.uuid, confirmedAt: user?.confirmedAt };
  }
}

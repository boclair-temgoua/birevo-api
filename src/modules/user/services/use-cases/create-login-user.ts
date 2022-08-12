import { FindOneUserByService } from '../query/find-one-user-by.service';
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { useCatch } from 'src/infrastructure/utils/use-catch';
import { CreateLoginUserDto } from '../../dto/validation-user.dto';
import { sign, verify } from 'jsonwebtoken';
import { JwtPayloadType } from '../../types';
import { CheckUserService } from '../../middleware/check-user.service';

@Injectable()
export class CreateLoginUser {
  constructor(
    private readonly findOneUserByService: FindOneUserByService,
    private readonly checkUserService: CheckUserService,
  ) {}

  /** Create one login to the database. */
  async createOneLogin(options: CreateLoginUserDto): Promise<any> {
    const { email, password } = { ...options };

    const [_error, user] = await useCatch(
      this.findOneUserByService.findOneBy({ option2: { email } }),
    );
    if (_error) {
      throw new NotFoundException(_error);
    }
    if (!user?.checkIfPasswordMatch(password))
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);
    /** Fix create JWT token */

    const jwtPayload: JwtPayloadType = {
      id: user.id,
      uuid: user.uuid,
      profileId: user.profileId,
      lastName: user?.profile?.lastName,
      firstName: user?.profile?.firstName,
      organizationId: user.organizationInUtilizationId,
    };

    const refreshToken = await this.checkUserService.createJwtTokens(
      jwtPayload,
    );
    return 'Bearer ' + refreshToken;
  }
}

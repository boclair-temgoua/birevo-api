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
import { configurations } from '../../../../infrastructure/configurations/index';
import { CreateOrUpdateUserService } from '../mutations/create-or-update-user.service';

@Injectable()
export class JwtCheckUserService {
  constructor(
    private readonly findOneUserByService: FindOneUserByService,
    private readonly createOrUpdateUserService: CreateOrUpdateUserService,
  ) {}

  async createRefreshToken(payload: JwtPayloadType) {
    const [_error, user] = await useCatch(
      this.findOneUserByService.findOneBy({ option1: { userId: payload?.id } }),
    );
    if (_error) {
      throw new NotFoundException(_error);
    }
    const refreshToken = await this.createJwtToken('refresh', payload);

    if (!user.refreshToken) {
      const [errorU, _saveItem] = await useCatch(
        this.createOrUpdateUserService.updateOne(
          { option1: { userId: payload?.id } },
          { refreshToken: [refreshToken] },
        ),
      );
      if (errorU) {
        throw new NotFoundException(errorU);
      }
    } else {
      const [_errorU, _saveItem] = await useCatch(
        this.createOrUpdateUserService.updateOne(
          { option1: { userId: payload?.id } },
          { refreshToken: [...user.refreshToken, refreshToken] },
        ),
      );
      if (_errorU) {
        throw new NotFoundException(_errorU);
      }
    }

    return refreshToken;
  }

  /** Create one createJwtToken for use and save to the database. */
  async createJwtToken(type: 'access' | 'refresh', payload: JwtPayloadType) {
    const secret =
      type === 'access'
        ? configurations.jwt.secret
        : configurations.jwt.refreshSecret;
    const expiresIn =
      type === 'access'
        ? configurations.jwt.expiration
        : configurations.jwt.refreshExpiration;

    return sign(payload, secret, {
      expiresIn,
    });
  }

  /** Create one CreateJwtTokens to the database. */
  async createJwtTokens(payload: JwtPayloadType): Promise<any> {
    const token = this.createJwtToken('access', payload);
    const refreshToken = await this.createRefreshToken(payload);
    return token;
  }
}

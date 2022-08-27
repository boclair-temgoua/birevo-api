import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configurations } from '../../../infrastructure/configurations';
import {
  UnauthorizedException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { FindOneUserByService } from '../services/query/find-one-user-by.service';
import { User } from '../../../models/User';
import { GetAuthorizationToSubscribe } from '../../subscribe/services/use-cases/get-authorization-to-subscribe';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly findOneUserByService: FindOneUserByService,
    private readonly getAuthorizationToSubscribe: GetAuthorizationToSubscribe,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configurations.jwt.secret,
    });
  }

  async validate(payload): Promise<User> {
    const [_error, user] = await useCatch(
      this.findOneUserByService.findOneBy({ option1: { userId: payload?.id } }),
    );
    if (_error) {
      throw new NotFoundException(_error);
    }
    if (!user) throw new UnauthorizedException('User invalid');

    const [_errorOr, result] = await useCatch(
      this.getAuthorizationToSubscribe.execute({
        organizationId: user?.organizationInUtilizationId,
        userId: user?.id,
        type: 'ORGANIZATION',
      }),
    );
    if (_errorOr) {
      throw new NotFoundException(_errorOr);
    }
    if (!result?.subscribeOrganization) throw new UnauthorizedException();

    return user;
  }
}

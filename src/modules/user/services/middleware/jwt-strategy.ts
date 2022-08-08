import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configurations } from '../../../../infrastructure/configurations';
import {
  UnauthorizedException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { useCatch } from 'src/infrastructure/utils/use-catch';
import { FindOneUserByService } from '../query/find-one-user-by.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly findOneUserByService: FindOneUserByService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configurations.jwt.secret,
    });
  }

  async validate(payload) {
    const [_error, user] = await useCatch(
      this.findOneUserByService.findOneBy({ option1: { userId: payload?.id } }),
    );
    if (_error) {
      throw new NotFoundException(_error);
    }
    if (!user)
      throw new UnauthorizedException('Invalid token please try later');
    return user;
  }
}

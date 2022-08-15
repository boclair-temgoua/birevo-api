import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configurations } from '../../../infrastructure/configurations';
import {
  UnauthorizedException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { useCatch } from 'src/infrastructure/utils/use-catch';
import { FindOneUserByService } from '../services/query/find-one-user-by.service';
import { User } from '../../../models/User';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly findOneUserByService: FindOneUserByService) {
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
    return user;
  }
}

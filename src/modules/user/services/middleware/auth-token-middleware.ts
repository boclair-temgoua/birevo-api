import {
  UnauthorizedException,
  NotFoundException,
  HttpException,
  HttpStatus,
  NestMiddleware,
  Injectable,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FindOneApplicationTokenByService } from '../../../application-token/services/query/find-one-application-token-by.service';
import { useCatch } from 'src/infrastructure/utils/use-catch';
import { FindOneUserByService } from '../query/find-one-user-by.service';

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly findOneUserByService: FindOneUserByService,
    private readonly findOneApplicationTokenByService: FindOneApplicationTokenByService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.get('Authorization');
    const token: string = authHeader.split(' ')[1];

    if (!token)
      throw new HttpException(
        'Invalid token or expired please try later',
        HttpStatus.UNAUTHORIZED,
      );

    /** Find application token to database */
    const [_error, applicationToken] = await useCatch(
      this.findOneApplicationTokenByService.findOneBy({ option2: { token } }),
    );
    if (_error) {
      throw new NotFoundException(_error);
    }
    if (!applicationToken)
      throw new UnauthorizedException(
        'Invalid token or expired please try later',
      );

    /** Find user to database */
    const [_errorU, user] = await useCatch(
      this.findOneUserByService.findOneBy({
        option1: { userId: applicationToken.userId },
      }),
    );
    if (_errorU) {
      throw new NotFoundException(_errorU);
    }
    if (!user) throw new UnauthorizedException('User invalid');

    (req as any).user = { ...user, applicationToken };

    next();
  }
}

import { FindOneUserByService } from '../query/find-one-user-by.service';
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { useCatch } from 'src/infrastructure/utils/use-catch';
import { CreateLoginUserDto } from '../../dto/create-login-user.dto';

@Injectable()
export class CreateLoginUserService {
  constructor(private readonly findOneUserByService: FindOneUserByService) {}

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

    return user;
  }
}

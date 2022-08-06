import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneUserSelections } from '../../types/index';
import { User } from '../../../../models/User';

@Injectable()
export class FindOneUserByService {
  constructor(
    @InjectRepository(User)
    private driver: Repository<User>,
  ) {}

  async findOneBy(selections: GetOneUserSelections): Promise<User> {
    const { option1, option2, option3 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('user')
      .where('user.deletedAt IS NULL')
      .leftJoinAndSelect('user.profile', 'profile');

    if (option1) {
      const { userId } = { ...option1 };
      query = query.andWhere('user.id = :id', { id: userId });
    }

    if (option2) {
      const { email } = { ...option2 };
      query = query.andWhere('user.email = :email', { email });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return result;
  }

  async findOneInfoBy(selections: GetOneUserSelections): Promise<User> {
    const { option1, option2, option4 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('user')
      .select('user.uuid', 'uuid')
      .addSelect('user.id', 'id')
      .addSelect('user.email', 'email')
      .addSelect('user.profileId', 'profileId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
      'userId', "user"."id",
      'firstName', "profile"."firstName",
      'image', "profile"."image",
      'currencyId', "profile"."currencyId",
      'lastName', "profile"."lastName"
  ) AS "profile"`,
      )
      .where('user.deletedAt IS NULL')
      .leftJoin('user.profile', 'profile')
      .leftJoin('user.organizationInUtilization', 'organization');

    if (option1) {
      const { userId } = { ...option1 };
      query = query.andWhere('user.id = :id', { id: userId });
    }

    if (option2) {
      const { email } = { ...option2 };
      query = query.andWhere('user.email = :email', { email });
    }

    if (option4) {
      const { user_uuid } = { ...option4 };
      query = query.andWhere('user.uuid = :uuid', { uuid: user_uuid });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return result;
  }
}

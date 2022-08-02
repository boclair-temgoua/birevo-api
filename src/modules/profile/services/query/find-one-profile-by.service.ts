import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneProfileSelections } from '../../types/index';
import { Profile } from '../../../../models/Profile';

@Injectable()
export class FindOneProfileByService {
  constructor(
    @InjectRepository(Profile)
    private driver: Repository<Profile>,
  ) {}

  async findOneBy(selections: GetOneProfileSelections): Promise<Profile> {
    const { option1 } = { ...selections };
    let query = this.driver.createQueryBuilder('profile');

    if (option1) {
      const { profileId } = { ...option1 };
      query = query.where('profile.id = :id', { id: profileId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);

    return result;
  }
}

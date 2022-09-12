import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneUserAddressSelections } from '../../types/index';
import { UserAddress } from '../../../../models/UserAddress';

@Injectable()
export class FindOneUserAddressByService {
  constructor(
    @InjectRepository(UserAddress)
    private driver: Repository<UserAddress>,
  ) {}

  async findOneBy(
    selections: GetOneUserAddressSelections,
  ): Promise<UserAddress> {
    const { option1 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('userAddress')
      .where('userAddress.deletedAt IS NULL');

    if (option1) {
      const { user_address_uuid } = { ...option1 };
      query = query.andWhere('userAddress.uuid = :uuid', {
        uuid: user_address_uuid,
      });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('UserAddress not found', HttpStatus.NOT_FOUND);

    return result;
  }
}

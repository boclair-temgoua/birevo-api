import {
  Controller,
  Post,
  NotFoundException,
  Body,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';

import { JwtAuthGuard } from '../../user/middleware/jwt-auth.guard';
import { CreateOrUpdateUserAddressDto } from '../dto/validation-user-address.dto';
import { CreateOrUpdateUserAddressService } from '../services/mutations/create-or-update-user-address.service';

@Controller('user-address')
export class CreateOrUpdateUserAddressController {
  constructor(
    private readonly createOrUpdateUserAddressService: CreateOrUpdateUserAddressService,
  ) {}

  /** Stripe controller send */
  @Post(`/create-or-update`)
  @UseGuards(JwtAuthGuard)
  async createOneStripe(
    @Res() res,
    @Req() req,
    @Body() createOrUpdateUserAddressDto: CreateOrUpdateUserAddressDto,
  ) {
    const { user } = req;
    const {
      user_address_uuid,
      company,
      city,
      phone,
      region,
      street1,
      street2,
      cap,
      countryId,
    } = {
      ...createOrUpdateUserAddressDto,
    };
    const [errors, result] = await useCatch(
      user_address_uuid
        ? this.createOrUpdateUserAddressService.updateOne(
            { option1: { user_address_uuid } },
            {
              company,
              city,
              phone,
              region,
              street1,
              street2,
              cap,
              countryId,
            },
          )
        : this.createOrUpdateUserAddressService.createOne({
            company,
            city,
            phone,
            region,
            street1,
            street2,
            cap,
            countryId,
            userId: user?.organizationInUtilization?.id,
            organizationId: user?.organizationInUtilizationId,
          }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results: result });
  }
}

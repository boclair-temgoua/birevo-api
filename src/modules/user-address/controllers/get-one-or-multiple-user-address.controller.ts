import {
  Controller,
  Get,
  ParseUUIDPipe,
  NotFoundException,
  Query,
  UseGuards,
  Req,
  Res,
  ParseBoolPipe,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { JwtAuthGuard } from '../../user/middleware';
import { FindUserAddressService } from '../services/query/find-user-address.service';
import { FindOneUserAddressByService } from '../services/query/find-one-user-address-by.service';

@Controller('user-address')
export class GetOneOrMultipleUserAddressController {
  constructor(
    private readonly FindOneUserAddressByService: FindOneUserAddressByService,
    private readonly findUserAddressService: FindUserAddressService,
  ) {}

  @Get(`/show/:user_address_uuid`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUIDApplication(
    @Res() res,
    @Req() req,
    @Param('user_address_uuid', ParseUUIDPipe) user_address_uuid: string,
  ) {
    const [error, result] = await useCatch(
      this.FindOneUserAddressByService.findOneBy({
        option1: { user_address_uuid },
      }),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }

  @Get(`/billing/:organizationId`)
  @UseGuards(JwtAuthGuard)
  async getUserAddress(
    @Res() res,
    @Req() req,
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ) {
    const [errors, results] = await useCatch(
      this.findUserAddressService.findAll({
        option2: { organizationId },
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }
}

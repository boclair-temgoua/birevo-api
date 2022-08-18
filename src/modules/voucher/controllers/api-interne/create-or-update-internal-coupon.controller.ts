import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  Res,
  Query,
  Req,
  ParseIntPipe,
  Post,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { reply } from '../../../../infrastructure/utils/reply';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateOrUpdateVoucherService } from '../../services/mutations/create-or-update-voucher.service';
import { CreateOrUpdateVoucherDto } from '../../dto/validation-voucher.dto';
import { CreateOrUpdateVoucher } from '../../services/use-cases/create-or-update-voucher';
import { JwtAuthGuard } from '../../../user/middleware/jwt-auth.guard';

@Controller('vouchers')
export class CreateOrUpdateInternalCouponController {
  constructor(private readonly createOrUpdateVoucher: CreateOrUpdateVoucher) {}

  @Post(`/c/create-or-update`)
  @UseGuards(JwtAuthGuard)
  async createOneCoupon(
    @Res() res,
    @Req() req,
    @Body() createOrUpdateVoucherDto: CreateOrUpdateVoucherDto,
  ) {
    const [error, result] = await useCatch(
      this.createOrUpdateVoucher.create({
        ...createOrUpdateVoucherDto,
        user: req?.user,
      }),
    );
    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }
}

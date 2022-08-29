import {
  Controller,
  Get,
  Param,
  Headers,
  NotFoundException,
  Res,
  Query,
  Req,
  ParseIntPipe,
  Post,
  Delete,
  Body,
  UseGuards,
  Put,
} from '@nestjs/common';
import { reply } from '../../../../infrastructure/utils/reply';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateOrUpdateVoucherService } from '../../services/mutations/create-or-update-voucher.service';
import {
  CodeVoucherDto,
  CreateOrUpdateVoucherDto,
} from '../../dto/validation-voucher.dto';
import { CreateOrUpdateVoucher } from '../../services/use-cases/create-or-update-voucher';
import { JwtAuthGuard } from '../../../user/middleware/jwt-auth.guard';
import { getIpRequest } from '../../../../infrastructure/utils/commons';

@Controller('vouchers')
export class CreateOrUpdateInternalCouponController {
  constructor(private readonly createOrUpdateVoucher: CreateOrUpdateVoucher) {}

  @Post(`/c/create-or-update`)
  @UseGuards(JwtAuthGuard)
  async createOneCoupon(
    @Res() res,
    @Req() req,
    @Body() createOrUpdateVoucherDto: CreateOrUpdateVoucherDto,
    @Headers('User-Agent') userAgent: string,
  ) {
    const [error, result] = await useCatch(
      this.createOrUpdateVoucher.create({
        ...createOrUpdateVoucherDto,
        ipLocation: getIpRequest(req),
        userAgent,
        user: req?.user,
        type: 'COUPON',
      }),
    );
    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }

  @Put(`/c/use/:code`)
  @UseGuards(JwtAuthGuard)
  async useOneCoupon(
    @Res() res,
    @Req() req,
    @Param() codeVoucher: CodeVoucherDto,
    @Headers('User-Agent') userAgent: string,
  ) {
    const [error, result] = await useCatch(
      this.createOrUpdateVoucher.useVoucherExternOrInterne({
        ...codeVoucher,
        ipLocation: getIpRequest(req),
        userAgent,
        user: req.user,
      }),
    );
    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: 'result' });
  }

  @Post(`/v/create-or-update`)
  @UseGuards(JwtAuthGuard)
  async createOneVoucher(
    @Res() res,
    @Req() req,
    @Body() createOrUpdateVoucherDto: CreateOrUpdateVoucherDto,
    @Headers('User-Agent') userAgent: string,
  ) {
    const [error, result] = await useCatch(
      this.createOrUpdateVoucher.create({
        ...createOrUpdateVoucherDto,
        ipLocation: getIpRequest(req),
        userAgent,
        user: req?.user,
        type: 'VOUCHER',
      }),
    );
    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }

  @Delete(`/delete/:code`)
  @UseGuards(JwtAuthGuard)
  async deleteOneCoupon(
    @Res() res,
    @Req() req,
    @Param() codeVoucher: CodeVoucherDto,
    @Headers('User-Agent') userAgent: string,
  ) {
    const [error, result] = await useCatch(
      this.createOrUpdateVoucher.deleteVoucherExtern({
        ...codeVoucher,
        ipLocation: getIpRequest(req),
        userAgent,
        user: req.user,
      }),
    );
    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }
}

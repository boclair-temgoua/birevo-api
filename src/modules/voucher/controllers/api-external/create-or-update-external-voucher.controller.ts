import {
  Controller,
  Param,
  NotFoundException,
  Res,
  Req,
  Post,
  Headers,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { reply } from '../../../../infrastructure/utils/reply';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import {
  CodeVoucherDto,
  CreateOrUpdateVoucherDto,
} from '../../dto/validation-voucher.dto';
import { CreateOrUpdateVoucher } from '../../services/use-cases/create-or-update-voucher';
import { getIpRequest } from '../../../../infrastructure/utils/commons/get-ip-request';
import { UnauthorizedException } from '@nestjs/common';

@Controller('re')
export class CreateOrUpdateExternalVoucherController {
  constructor(private readonly createOrUpdateVoucher: CreateOrUpdateVoucher) {}

  /** Create coupon */
  @Post(`/coupons/create`)
  async createOneCoupon(
    @Res() res,
    @Req() req,
    @Body() createOrUpdateVoucherDto: CreateOrUpdateVoucherDto,
    @Headers('User-Agent') userAgent: string,
  ) {
    const { user } = req;
    if (user?.requiresPayment)
      throw new UnauthorizedException(
        'Payment required please check your billing',
      );

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

  /** Update coupon */
  @Post(`/vouchers/create`)
  async createOneVoucher(
    @Res() res,
    @Req() req,
    @Body() createOrUpdateVoucherDto: CreateOrUpdateVoucherDto,
    @Headers('User-Agent') userAgent: string,
  ) {
    const { user } = req;
    if (user?.requiresPayment)
      throw new UnauthorizedException(
        'Payment required please check your billing',
      );

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

  /** Update coupon */
  @Put(`/coupons/use`)
  async useOneCoupon(
    @Res() res,
    @Req() req,
    @Body() codeVoucher: CodeVoucherDto,
    @Headers('User-Agent') userAgent: string,
  ) {
    const { user } = req;
    if (user?.requiresPayment)
      throw new UnauthorizedException(
        'Payment required please check your billing',
      );

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
    return reply({ res, results: result });
  }

  /** Delete voucher */
  @Delete(`/vouchers/delete/:code`)
  async deleteOneCoupon(
    @Res() res,
    @Req() req,
    @Param() codeVoucher: CodeVoucherDto,
    @Headers('User-Agent') userAgent: string,
  ) {
    const { user } = req;
    if (user?.requiresPayment)
      throw new UnauthorizedException(
        'Payment required please check your billing',
      );

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

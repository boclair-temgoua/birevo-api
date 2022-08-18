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
  Headers,
  Body,
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
import { getIpRequest } from '../../../../infrastructure/utils/commons/get-ip-request';

@Controller('re')
export class CreateOrUpdateExternalVoucherController {
  constructor(private readonly createOrUpdateVoucher: CreateOrUpdateVoucher) {}

  @Post(`/vouchers/create`)
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

  @Put(`/vouchers/use/:code`)
  async useOneCoupon(
    @Res() res,
    @Req() req,
    @Param() codeVoucher: CodeVoucherDto,
    @Headers('User-Agent') userAgent: string,
  ) {
    const [error, result] = await useCatch(
      this.createOrUpdateVoucher.useVoucherExtern({
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

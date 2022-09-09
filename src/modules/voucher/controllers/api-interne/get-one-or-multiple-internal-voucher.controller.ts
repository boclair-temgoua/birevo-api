import { getIpRequest } from '../../../../infrastructure/utils/commons';
import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UseGuards,
  Req,
  Res,
  Headers,
  ParseBoolPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { reply } from '../../../../infrastructure/utils/reply';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { JwtAuthGuard } from '../../../user/middleware';
import {
  GetOneVoucherDto,
  VoucherableType,
} from '../../dto/validation-voucher.dto';
import { GetOnUserVoucher } from '../../services/use-cases/get-on-user-voucher';
import { FilterQueryDto } from '../../../../infrastructure/utils/filter-query/filter-query.dto';
import { RequestPaginationDto } from '../../../../infrastructure/utils/pagination/request-pagination.dto';
import { FindVoucherService } from '../../services/query/find-voucher.service';

@Controller('vouchers')
export class GetOneOrMultipleInternalVoucherController {
  constructor(
    private readonly getOnUserVoucher: GetOnUserVoucher,
    private readonly findVoucherService: FindVoucherService,
  ) {}

  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async getAllVouchers(
    @Res() res,
    @Req() req,
    @Query() pagination: RequestPaginationDto,
    @Query() filterQuery: FilterQueryDto,
    @Query('is_paginate', ParseBoolPipe) is_paginate: boolean,
    @Query('type') type: VoucherableType,
  ) {
    const { user } = req;
    if (user?.requiresPayment)
      throw new UnauthorizedException(
        'Payment required please check your billing',
      );

    const [errors, results] = await useCatch(
      this.findVoucherService.findAllVouchers({
        is_paginate,
        filterQuery,
        pagination,
        type,
        option1: { userId: user?.organizationInUtilization?.userId },
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results: results });
  }

  @Get(`/show`)
  @UseGuards(JwtAuthGuard)
  async getOneByUuidOrrCode(
    @Res() res,
    @Req() req,
    @Query() getOneVoucherDto: GetOneVoucherDto,
    @Headers('User-Agent') userAgent: string,
  ) {
    const { user } = req;
    if (user?.requiresPayment)
      throw new UnauthorizedException(
        'Payment required please check your billing',
      );

    const [error, result] = await useCatch(
      this.getOnUserVoucher.executeIntern({
        ...getOneVoucherDto,
        ipLocation: getIpRequest(req),
        user: req?.user,
        userAgent,
      }),
    );
    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }
}

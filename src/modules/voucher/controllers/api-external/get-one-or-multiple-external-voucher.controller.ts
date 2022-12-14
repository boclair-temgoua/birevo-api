import { getIpRequest } from '../../../../infrastructure/utils/commons/get-ip-request';
import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query,
  Req,
  Res,
  Headers,
  ParseBoolPipe,
} from '@nestjs/common';
import { reply } from '../../../../infrastructure/utils/reply';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneVoucherDto } from '../../dto/validation-voucher.dto';
import { GetOnUserVoucher } from '../../services/use-cases/get-on-user-voucher';
import { FilterQueryDto } from '../../../../infrastructure/utils/filter-query/filter-query.dto';
import { RequestPaginationDto } from '../../../../infrastructure/utils/pagination/request-pagination.dto';
import { FindVoucherService } from '../../services/query/find-voucher.service';
import { UnauthorizedException } from '@nestjs/common';
import {
  VoucherableTypeDto,
  getOneByNumberVoucherType,
} from '../../dto/validation-voucher.dto';

@Controller('re')
export class GetOneOrMultipleExternalVoucherController {
  constructor(
    private readonly getOnUserVoucher: GetOnUserVoucher,
    private readonly findVoucherService: FindVoucherService,
  ) {}

  @Get(`/vouchers`)
  async getAllVouchers(
    @Res() res,
    @Req() req,
    @Query() pagination: RequestPaginationDto,
    @Query() filterQuery: FilterQueryDto,
    @Query() type: VoucherableTypeDto,
    @Query('is_paginate', ParseBoolPipe) is_paginate: boolean,
  ) {
    const { user } = req;
    if (user?.organizationInUtilization?.requiresPayment)
      throw new UnauthorizedException(
        'Payment required please check your billing',
      );

    const [errors, results] = await useCatch(
      this.findVoucherService.findAllVouchers({
        is_paginate,
        filterQuery,
        pagination,
        type: getOneByNumberVoucherType(Number(type?.voucher_type)),
        option1: { userId: user?.id },
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results: results });
  }

  @Get(`/coupons/show/:code`)
  async getOneCouponByCode(
    @Res() res,
    @Req() req,
    @Param() getOneVoucherDto: GetOneVoucherDto,
    @Headers('User-Agent') userAgent: string,
  ) {
    const { user } = req;
    if (user?.organizationInUtilization?.requiresPayment)
      throw new UnauthorizedException(
        'Payment required please check your billing',
      );

    const [error, result] = await useCatch(
      this.getOnUserVoucher.executeExtern({
        ...getOneVoucherDto,
        ipLocation: getIpRequest(req),
        userAgent,
        user: req.user,
        type: 'COUPON',
      }),
    );
    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }

  @Get(`/vouchers/show/:code`)
  async getOneVoucherByCode(
    @Res() res,
    @Req() req,
    @Param() getOneVoucherDto: GetOneVoucherDto,
    @Headers('User-Agent') userAgent: string,
  ) {
    const { user } = req;
    if (user?.organizationInUtilization?.requiresPayment)
      throw new UnauthorizedException(
        'Payment required please check your billing',
      );

    const [error, result] = await useCatch(
      this.getOnUserVoucher.executeExtern({
        ...getOneVoucherDto,
        ipLocation: getIpRequest(req),
        userAgent,
        user: req.user,
        type: 'VOUCHER',
      }),
    );
    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }
}

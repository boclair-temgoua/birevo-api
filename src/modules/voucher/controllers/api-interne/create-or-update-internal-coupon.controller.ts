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
  UnauthorizedException,
} from '@nestjs/common';
import * as excel from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { reply } from '../../../../infrastructure/utils/reply';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import {
  CodeVoucherDto,
  CreateOrUpdateVoucherDto,
} from '../../dto/validation-voucher.dto';
import { CreateOrUpdateVoucher } from '../../services/use-cases/create-or-update-voucher';
import { JwtAuthGuard } from '../../../user/middleware/jwt-auth.guard';
import { getIpRequest } from '../../../../infrastructure/utils/commons';
import { FindVoucherService } from '../../services/query/find-voucher.service';
import {
  formateDateDDMMYYMomentJs,
  formateDateMMDDYYMomentJs,
} from '../../../../infrastructure/utils/commons/formate-date-momentjs';
import { CreateDownloadVoucherDto } from '../../dto/validation-voucher.dto';
import { FindOneOrganizationByService } from '../../../organization/services/query/find-one-organization-by.service';

@Controller('vouchers')
export class CreateOrUpdateInternalCouponController {
  constructor(
    private readonly createOrUpdateVoucher: CreateOrUpdateVoucher,
    private readonly findOneOrganizationByService: FindOneOrganizationByService,
    private readonly findVoucherService: FindVoucherService,
  ) {}

  @Post(`/c/create-or-update`)
  @UseGuards(JwtAuthGuard)
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

  @Put(`/c/use/:code`)
  @UseGuards(JwtAuthGuard)
  async useOneCoupon(
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

  @Delete(`/delete/:code`)
  @UseGuards(JwtAuthGuard)
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

  // /** Create download xlsx */
  @Get(`/download-xlsx`)
  async downloadAllVouchers(
    @Res() res,
    @Req() req,
    @Query() createDownloadVoucherDto: CreateDownloadVoucherDto,
  ) {
    const { type, status, organizationId, initiationAt, endAt } =
      createDownloadVoucherDto;

    /** Find one organization */
    const [_errorOr, organization] = await useCatch(
      this.findOneOrganizationByService.findOneBy({
        option1: { organizationId },
      }),
    );
    if (_errorOr) {
      throw new NotFoundException(_errorOr);
    }

    /** Find vouchers */
    const [errors, vouchers] = await useCatch(
      this.findVoucherService.findAllVouchers({
        is_paginate: false,
        type,
        status,
        option2: {
          organizationId: organization?.id,
          initiationAt: formateDateMMDDYYMomentJs(initiationAt),
          endAt: formateDateMMDDYYMomentJs(endAt),
        },
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet();
    worksheet.columns = [
      {
        header: 'code',
        key: 'codeNumber',
        width: 40,
        style: {
          alignment: { vertical: 'middle', horizontal: 'right' },
        },
      },
      {
        header: `status`,
        key: 'status',
        width: 40,
        style: {
          alignment: { vertical: 'middle', horizontal: 'center' },
        },
      },
      {
        header: `statusOnline`,
        key: 'statusOnline',
        width: 40,
        style: {
          alignment: { vertical: 'middle', horizontal: 'center' },
        },
      },
      {
        header: `voucher_type`,
        key: 'voucherType',
        width: 40,
        style: {
          alignment: { vertical: 'middle', horizontal: 'center' },
        },
      },
      {
        header: `amount`,
        key: 'amount',
        width: 40,
        style: {
          alignment: { vertical: 'middle', horizontal: 'right' },
        },
      },
      {
        header: `currency`,
        key: 'currency',
        width: 40,
        style: {
          alignment: { vertical: 'middle', horizontal: 'left' },
        },
      },
      {
        header: `percent %`,
        key: 'percent',
        width: 40,
        style: {
          alignment: { vertical: 'middle', horizontal: 'center' },
        },
      },
      {
        header: `startedAt`,
        key: 'startedAt',
        width: 40,
        style: {
          numFmt: 'dd/mm/yyyy',
          alignment: { vertical: 'middle', horizontal: 'center' },
        },
      },
      {
        header: `expiredAt`,
        key: 'expiredAt',
        width: 40,
        style: {
          numFmt: 'dd/mm/yyyy',
          alignment: { vertical: 'middle', horizontal: 'center' },
        },
      },
      {
        header: `createdAt`,
        key: 'createdAt',
        width: 40,
        style: {
          numFmt: 'dd/mm/yyyy',
          alignment: { vertical: 'middle', horizontal: 'center' },
        },
      },
    ];

    Promise.all([
      vouchers.map(async (item) => {
        const rowsItem = {
          codeNumber: item?.code,
          status: item?.status,
          statusOnline: item?.statusOnline,
          voucherType: item?.voucherType,
          amount: item?.amount,
          currency: item?.currency?.code,
          percent: item?.percent,
          startedAt: formateDateDDMMYYMomentJs(item?.startedAt),
          expiredAt: formateDateDDMMYYMomentJs(item?.expiredAt),
          createdAt: formateDateDDMMYYMomentJs(item?.createdAt),
        };
        worksheet.addRow(rowsItem);
      }),
    ]);

    const pathDirection = path.join('./src/modules/voucher', './public');
    const fileName = `voucher_date-${organization?.uuid}.xlsx`;
    await workbook.xlsx.writeFile(path.resolve(pathDirection, fileName));

    const file = `${pathDirection}/${fileName}`;

    res.download(file);
  }
}

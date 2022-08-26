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
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { JwtAuthGuard } from '../../user/middleware';
import { FilterQueryDto } from '../../../infrastructure/utils/filter-query/filter-query.dto';
import { RequestPaginationDto } from '../../../infrastructure/utils/pagination/request-pagination.dto';
import { FindActivityService } from '../services/query/find-activity.service';
import { FindOneVoucherByService } from '../../voucher/services/query/find-one-voucher-by.service';

@Controller('activities')
export class GetOneOrMultipleExternalActivityController {
  constructor(
    private readonly findActivityService: FindActivityService,
    private readonly findOneVoucherByService: FindOneVoucherByService,
  ) {}

  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async getAllActivities(
    @Res() res,
    @Req() req,
    @Query() pagination: RequestPaginationDto,
    @Query() filterQuery: FilterQueryDto,
    @Query('voucher_uuid', ParseUUIDPipe) voucher_uuid: string,
    @Query('is_paginate', ParseBoolPipe) is_paginate: boolean,
  ) {
    /** Find one voucher */
    const [error, voucher] = await useCatch(
      this.findOneVoucherByService.findOneBy({
        option1: { uuid: voucher_uuid },
      }),
    );
    if (error) {
      throw new NotFoundException(error);
    }

    /** Find activity with voucher */
    const [errors, results] = await useCatch(
      this.findActivityService.findAllActivities({
        is_paginate,
        filterQuery,
        pagination,
        option1: {
          activityAbleType: voucher?.voucherType,
          activityAbleId: voucher?.id,
        },
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results: results });
  }
}

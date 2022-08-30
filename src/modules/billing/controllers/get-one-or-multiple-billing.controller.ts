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
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { JwtAuthGuard } from '../../user/middleware';
import { FilterQueryDto } from '../../../infrastructure/utils/filter-query/filter-query.dto';
import { RequestPaginationDto } from '../../../infrastructure/utils/pagination/request-pagination.dto';
import { FindAmountService } from '../../amount/services/query/find-amount.service';

@Controller('billings')
export class GetOneOrMultipleBillingController {
  constructor(private readonly findAmountService: FindAmountService) {}

  @Get(`/billing_history`)
  @UseGuards(JwtAuthGuard)
  async getAllActivities(
    @Res() res,
    @Req() req,
    @Query() pagination: RequestPaginationDto,
    @Query() filterQuery: FilterQueryDto,
  ) {
    const { user } = req;
    const [errors, results] = await useCatch(
      this.findAmountService.findAllAmounts({
        pagination,
        option1: {
          userId: user?.organizationInUtilization?.userId,
          organizationId: user?.organizationInUtilizationId,
        },
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }
}

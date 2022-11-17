import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UseGuards,
  Req,
  Res,
  Param,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { JwtAuthGuard } from '../../user/middleware';
import { FilterQueryDto } from '../../../infrastructure/utils/filter-query/filter-query.dto';
import { RequestPaginationDto } from '../../../infrastructure/utils/pagination/request-pagination.dto';
import { FindAmountService } from '../../amount/services/query/find-amount.service';
import { FindOneAmountByService } from '../../amount/services/query/find-one-amount-by.service';

@Controller('billings')
export class GetOneOrMultipleBillingController {
  constructor(
    private readonly findAmountService: FindAmountService,
    private readonly findOneAmountByService: FindOneAmountByService,
  ) {}

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

  @Get(`/billing_success/:token`)
  @UseGuards(JwtAuthGuard)
  async getOneAmount(@Res() res, @Req() req, @Param('token') token: string) {
    const { user } = req;
    const [errors, result] = await useCatch(
      this.findOneAmountByService.findOneBy({
        option2: { token, organizationId: user?.organizationInUtilizationId },
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results: result });
  }

  @Get(`/billing_xml/:token`)
  @UseGuards(JwtAuthGuard)
  async getOneAmountXML(@Res() res, @Req() req, @Param('token') token: string) {
    const { user } = req;
    console.log(`token ======>`, token);
    // const [errors, result] = await useCatch(
    //   this.findOneAmountByService.findOneBy({
    //     option2: { token, organizationId: user?.organizationInUtilizationId },
    //   }),
    // );
    // if (errors) {
    //   throw new NotFoundException(errors);
    // }
    return reply({ res, results: 'result' });
  }
}

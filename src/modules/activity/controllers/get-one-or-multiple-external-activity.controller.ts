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
import { FindActivityService } from '../services/query/find-activity.service';
import { FindOneVoucherByService } from '../../voucher/services/query/find-one-voucher-by.service';
import { GetMultipleActivityDto } from '../dto/validation-activity.dto';
import { GetOneOrMultipleActivity } from '../services/user-cases/get-one-or-multiple-activity';

@Controller('activities')
export class GetOneOrMultipleExternalActivityController {
  constructor(
    private readonly getOneOrMultipleActivity: GetOneOrMultipleActivity,
  ) {}

  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async getAllActivities(
    @Res() res,
    @Req() req,
    @Query() pagination: RequestPaginationDto,
    @Query() filterQuery: FilterQueryDto,
    @Query() getMultipleActivityDto: GetMultipleActivityDto,
  ) {
    const [errors, results] = await useCatch(
      this.getOneOrMultipleActivity.execute({
        ...getMultipleActivityDto,
        ...pagination,
        ...filterQuery,
        user: req.user,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }
}

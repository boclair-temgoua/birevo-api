import {
  Controller,
  Get,
  Param,
  NotFoundException,
  UseGuards,
  Res,
  Query,
  Req,
  ParseIntPipe,
  ParseBoolPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { JwtAuthGuard } from '../../user/middleware';
import { FindOneSubscribeByService } from '../services/query/find-one-subscribe-by.service';
import { RequestPaginationDto } from '../../../infrastructure/utils/pagination/request-pagination.dto';
import { FilterQueryDto } from '../../../infrastructure/utils/filter-query/filter-query.dto';
import { FindSubscribeService } from '../services/query/find-subscribe.service';
import { GetAuthorizationToSubscribe } from '../services/use-cases/get-authorization-to-subscribe';

@Controller('subscribes')
export class GetOneOrMultipleSubscribeController {
  constructor(
    private readonly findOneSubscribeByService: FindOneSubscribeByService,
    private readonly getAuthorizationToSubscribe: GetAuthorizationToSubscribe,
    private readonly findSubscribeService: FindSubscribeService,
  ) {}

  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAllSubscribesBy(
    @Res() res,
    @Req() req,
    @Query() pagination: RequestPaginationDto,
    @Query() filterQuery: FilterQueryDto,
    @Query('is_paginate', ParseBoolPipe) is_paginate: boolean,
  ) {
    const { user } = req;
    /** get contributor filter by organization */
    const [errors, results] = await useCatch(
      this.findSubscribeService.findAllSubscribes({
        is_paginate,
        filterQuery,
        pagination,
        option1: {
          userId: user?.id,
          subscribableType: 'ORGANIZATION',
        },
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  @Get(`/contributors`)
  @UseGuards(JwtAuthGuard)
  async findAllContributorsBy(
    @Res() res,
    @Req() req,
    @Query() pagination: RequestPaginationDto,
    @Query() filterQuery: FilterQueryDto,
    @Query('is_paginate', ParseBoolPipe) is_paginate: boolean,
  ) {
    const { user } = req;
    const type = 'ORGANIZATION';
    // Check permission user action
    const [_errorOr, result] = await useCatch(
      this.getAuthorizationToSubscribe.execute({
        organizationId: user?.organizationInUtilizationId,
        userId: user?.id,
        type,
      }),
    );
    if (_errorOr) {
      throw new NotFoundException(_errorOr);
    }
    if (!result?.subscribeOrganization) throw new UnauthorizedException();

    /** get contributor filter by organization */
    const [errors, results] = await useCatch(
      this.findSubscribeService.findAllSubscribes({
        is_paginate,
        filterQuery,
        pagination,
        option2: {
          subscribableId: result?.subscribeOrganization?.subscribableId,
          subscribableType: type,
        },
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  @Get(`/show`)
  @UseGuards(JwtAuthGuard)
  async getOneByIDSubscribe(
    @Res() res,
    @Req() req,
    @Query('subscribableId', ParseIntPipe) subscribableId: number,
  ) {
    const { user } = req;
    const [error, result] = await useCatch(
      this.findOneSubscribeByService.findOneBy({
        option1: {
          userId: user?.id,
          subscribableId: subscribableId,
          subscribableType: 'ORGANIZATION',
          organizationId: user?.organizationInUtilizationId,
        },
      }),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }
}

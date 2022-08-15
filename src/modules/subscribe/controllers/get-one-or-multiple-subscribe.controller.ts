import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  UseGuards,
  Res,
  Query,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { JwtAuthGuard } from '../../user/middleware';
import { FindOneSubscribeByService } from '../services/query/find-one-subscribe-by.service';

@Controller('subscribes')
export class GetOneOrMultipleSubscribeController {
  constructor(
    private readonly findOneSubscribeByService: FindOneSubscribeByService,
  ) {}

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

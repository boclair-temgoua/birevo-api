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
  Post,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { JwtAuthGuard } from '../../user/middleware';
import { CreateOneContributorToSubscribe } from '../services/use-cases/create-one-contributor-to-subscribe';

@Controller('subscribes')
export class CreateOrUpdateOneSubscribeController {
  constructor(
    private readonly createOneContributorToSubscribe: CreateOneContributorToSubscribe,
  ) {}

  @Post(`/contributor-create`)
  @UseGuards(JwtAuthGuard)
  async createOneContributor(
    @Res() res,
    @Req() req,
    @Query('contributorId', ParseIntPipe) contributorId: number,
  ) {
    const { user } = req;
    const [error, result] = await useCatch(
      this.createOneContributorToSubscribe.execute({
        type: 'ORGANIZATION',
        userId: user?.id,
        organizationId: user?.organizationInUtilizationId,
        contributorId,
      }),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }
}

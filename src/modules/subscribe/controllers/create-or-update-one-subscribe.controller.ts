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
  Delete,
  Put,
  Body,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { JwtAuthGuard } from '../../user/middleware';
import { CreateOneContributorToSubscribe } from '../services/use-cases/create-one-contributor-to-subscribe';
import { CreateOrUpdateSubscribeService } from '../services/mutations/create-or-update-subscribe.service';
import { UpdateOnRoleSubscribeDto } from '../dto/validation-subscribe.dto';

@Controller('subscribes')
export class CreateOrUpdateOneSubscribeController {
  constructor(
    private readonly createOrUpdateSubscribeService: CreateOrUpdateSubscribeService,
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

  @Delete(`/delete/:subscribe_uuid`)
  @UseGuards(JwtAuthGuard)
  async deleteOneContributor(
    @Res() res,
    @Param('subscribe_uuid', ParseUUIDPipe) subscribe_uuid: string,
  ) {
    const [error, result] = await useCatch(
      this.createOrUpdateSubscribeService.updateOne(
        { option2: { subscribe_uuid } },
        { deletedAt: new Date() },
      ),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }

  @Put(`/contributor-update`)
  @UseGuards(JwtAuthGuard)
  async updateOneRoleContributor(
    @Res() res,
    @Body() updateOnRoleSubscribeDto: UpdateOnRoleSubscribeDto,
  ) {
    const { contributorId, roleId, subscribe_uuid } = updateOnRoleSubscribeDto;
    const [error, result] = await useCatch(
      this.createOrUpdateSubscribeService.updateOne(
        { option2: { subscribe_uuid } },
        { roleId },
      ),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }
}

import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  UseGuards,
  Res,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { FindOneOrganizationByService } from '../services/query/find-one-organization-by.service';
import { JwtAuthGuard } from '../../user/middleware';

@Controller('organizations')
export class GetOneOrMultipleOrganizationController {
  constructor(
    private readonly findOneOrganizationByService: FindOneOrganizationByService,
  ) {}

  @Get(`/show/:organization_uuid`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUIDOrganization(
    @Res() res,
    @Param('organization_uuid', ParseUUIDPipe) organization_uuid: string,
  ) {
    const [error, result] = await useCatch(
      this.findOneOrganizationByService.findOneBy({
        option2: { organization_uuid },
      }),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }
}

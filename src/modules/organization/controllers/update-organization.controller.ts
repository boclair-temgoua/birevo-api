import {
  Controller,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  Put,
  Body,
  UseGuards,
  Res,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { JwtAuthGuard } from '../../user/middleware/jwt-auth.guard';
import { CreateOrUpdateOrganizationService } from '../services/mutations/create-or-update-organization.service';

@Controller('organizations')
export class UpdateOrganizationController {
  constructor(
    private readonly createOrUpdateOrganizationService: CreateOrUpdateOrganizationService,
  ) {}

  /** Update organization account*/
  @Put(`/update/:organization_uuid`)
  @UseGuards(JwtAuthGuard)
  async deactivateProfile(
    @Res() res,
    @Body('name') name: string,
    @Param('organization_uuid', ParseUUIDPipe) organization_uuid: string,
  ) {
    const [errors, result] = await useCatch(
      this.createOrUpdateOrganizationService.updateOne(
        { option2: { organization_uuid } },
        { name },
      ),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results: result });
  }
}

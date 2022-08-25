import {
  Controller,
  Get,
  Param,
  Response,
  ParseUUIDPipe,
  NotFoundException,
  Put,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { reply } from '../../../../infrastructure/utils/reply';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { FindOneUserByService } from '../../services/query/find-one-user-by.service';
import { CreateOrUpdateUserService } from '../../services/mutations/create-or-update-user.service';
import { UpdateInfoUserDto } from '../../dto/validation-user.dto';
import { UpdateOrganizationToUser } from '../../services/use-cases/update-organization-to-user';
import { JwtAuthGuard } from '../../middleware/jwt-auth.guard';

@Controller('users')
export class UpdateContactController {
  constructor(
    private readonly createOrUpdateUserService: CreateOrUpdateUserService,
    private readonly updateOrganizationToUser: UpdateOrganizationToUser,
  ) {}

  @Put(`/update/:user_uuid`)
  async createOneContact(
    @Response() res: any,
    @Body() updateInfoUserDto: UpdateInfoUserDto,
    @Param('user_uuid', ParseUUIDPipe) user_uuid: string,
  ) {
    const [errors, results] = await useCatch(
      this.createOrUpdateUserService.updateOne(
        { option4: { user_uuid } },
        { ...updateInfoUserDto },
      ),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  @Get(`/update-organization-to-user`)
  @UseGuards(JwtAuthGuard)
  async updateOneOrganization(
    @Res() res,
    @Req() req,
    @Query('organizationId', ParseIntPipe) organizationId: number,
  ) {
    const { user } = req;
    const [errors, result] = await useCatch(
      this.updateOrganizationToUser.updateOrganization({
        organizationId,
        user,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results: result });
  }
}

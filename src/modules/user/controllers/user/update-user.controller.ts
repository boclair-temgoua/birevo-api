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
  ParseBoolPipe,
} from '@nestjs/common';
import { reply } from '../../../../infrastructure/utils/reply';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateOrUpdateUserService } from '../../services/mutations/create-or-update-user.service';
import {
  UpdateEmailUserDto,
  UpdateInfoUserDto,
} from '../../dto/validation-user.dto';
import { UpdateOrganizationToUser } from '../../services/use-cases/update-organization-to-user';
import { JwtAuthGuard } from '../../middleware/jwt-auth.guard';
import { UpdateChangePasswordUserDto } from '../../dto/validation-user.dto';
import { ChangePasswordUser } from '../../services/use-cases/change-password-user';
import { UpdateInformationToUser } from '../../services/use-cases/update-information-to-user';
import { CreateOrUpdateProfileDto } from '../../../profile/dto/validation-profile.dto';
import { CreateOrUpdateProfileService } from '../../../profile/services/mutations/create-or-update-profile.service';

@Controller('users')
export class UpdateContactController {
  constructor(
    private readonly changePasswordUser: ChangePasswordUser,
    private readonly updateInformationToUser: UpdateInformationToUser,
    private readonly updateOrganizationToUser: UpdateOrganizationToUser,
    private readonly createOrUpdateUserService: CreateOrUpdateUserService,
    private readonly createOrUpdateProfileService: CreateOrUpdateProfileService,
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

  /** Change email account*/
  @Put(`/update-email`)
  @UseGuards(JwtAuthGuard)
  async updateEmailUser(
    @Res() res,
    @Req() req,
    @Body() updateEmailUserDto: UpdateEmailUserDto,
  ) {
    const { user } = req;
    const [errors, result] = await useCatch(
      this.updateInformationToUser.updateEmailToUser({
        ...updateEmailUserDto,
        user,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results: result });
  }

  /** Change password account*/
  @Put(`/update-password`)
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Res() res,
    @Req() req,
    @Body() updateChangePasswordUserDto: UpdateChangePasswordUserDto,
  ) {
    const { user } = req;
    const userId = user?.id;
    const [errors, results] = await useCatch(
      this.changePasswordUser.execute({
        ...updateChangePasswordUserDto,
        userId,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  /** Update profile account*/
  @Put(`/update-profile/:profileId`)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Res() res,
    @Req() req,
    @Body() createOrUpdateProfileDto: CreateOrUpdateProfileDto,
    @Param('profileId', ParseIntPipe) profileId: number,
  ) {
    const [errors, result] = await useCatch(
      this.createOrUpdateProfileService.updateOne(
        { option1: { profileId } },
        { ...createOrUpdateProfileDto },
      ),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results: result });
  }

  /** Update profile account*/
  @Put(`/deactivate-user/:user_uuid`)
  @UseGuards(JwtAuthGuard)
  async deactivateProfile(
    @Res() res,
    @Body('confirm', ParseBoolPipe) confirm: boolean,
    @Param('user_uuid', ParseUUIDPipe) user_uuid: string,
  ) {
    const [errors, result] = await useCatch(
      this.createOrUpdateUserService.updateOne(
        { option4: { user_uuid } },
        { deletedAt: new Date() },
      ),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results: result });
  }
}

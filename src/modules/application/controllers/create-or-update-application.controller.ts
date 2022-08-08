import {
  Controller,
  Post,
  Response,
  NotFoundException,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { JwtAuthGuard } from '../../user/services/middleware';

import {
  CreateOrUpdateApplicationDto,
  ApplicationUuidDto,
} from '../dto/validation-application.dto';
import {
  CreateOneApplicationTokenApplication,
  CreateOrUpdateApplication,
} from '../services/use-cases';

@Controller('applications')
export class CreateOrUpdateApplicationController {
  constructor(
    private readonly createOrUpdateApplication: CreateOrUpdateApplication,
    private readonly createOneApplicationTokenApplication: CreateOneApplicationTokenApplication,
  ) {}

  @Post(`/create-or-update`)
  @UseGuards(JwtAuthGuard)
  async createOneApplication(
    @Response() res: any,
    @Request() req: any,
    @Body() createOrUpdateApplicationDto: CreateOrUpdateApplicationDto,
  ) {
    const { user } = req;
    const [errors, results] = await useCatch(
      this.createOrUpdateApplication.createOrUpdate({
        ...createOrUpdateApplicationDto,
        user,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  @Post(`/create-new-token`)
  @UseGuards(JwtAuthGuard)
  async createOneToken(
    @Response() res: any,
    @Body() applicationUuidDto: ApplicationUuidDto,
  ) {
    const [errors, results] = await useCatch(
      this.createOneApplicationTokenApplication.createOne({
        ...applicationUuidDto,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  @Delete(`/delete/:application_uuid`)
  @UseGuards(JwtAuthGuard)
  async deleteOneApplication(
    @Response() res: any,
    @Param('application_uuid', ParseUUIDPipe) application_uuid: string,
  ) {
    const [errors, results] = await useCatch(
      this.createOrUpdateApplication.deleteOne({ application_uuid }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }
}

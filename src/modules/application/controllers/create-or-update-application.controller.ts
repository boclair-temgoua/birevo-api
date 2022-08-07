import {
  Controller,
  Post,
  Response,
  NotFoundException,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
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
  async createOneApplication(
    @Response() res: any,
    @Body() createOrUpdateApplicationDto: CreateOrUpdateApplicationDto,
  ) {
    const [errors, results] = await useCatch(
      this.createOrUpdateApplication.createOrUpdate({
        ...createOrUpdateApplicationDto,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  @Post(`/create-new-token`)
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

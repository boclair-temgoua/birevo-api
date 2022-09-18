import {
  Controller,
  Post,
  Req,
  NotFoundException,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  Put,
  UseGuards,
  Res,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { CreateOrUpdateContactDto } from '../dto/validation-contact.dto';
import { CreateOrUpdateContactService } from '../services/mutations/create-or-update-contact.service';
import { JwtAuthGuard } from '../../user/middleware/jwt-auth.guard';
import { getIpRequest } from '../../../infrastructure/utils/commons/get-ip-request';

@Controller('contacts')
export class CreateOrUpdateContactController {
  constructor(
    private readonly createOrUpdateContactService: CreateOrUpdateContactService,
  ) {}

  @Post(`/create`)
  async createOne(
    @Req() req,
    @Res() res,
    @Body() createOrUpdateContactDto: CreateOrUpdateContactDto,
  ) {
    const { fullName, email, countryId } = { ...createOrUpdateContactDto };
    const [errors, result] = await useCatch(
      this.createOrUpdateContactService.createOne({
        email,
        fullName,
        countryId,
        ipLocation: getIpRequest(req),
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results: result });
  }

  @Put(`/update/:contact_uuid`)
  // @UseGuards(JwtAuthGuard)
  async updateOneContact(
    @Req() req,
    @Res() res,
    @Body() createOrUpdateContactDto: CreateOrUpdateContactDto,
    @Param('contact_uuid', ParseUUIDPipe) contact_uuid: string,
  ) {
    const [errors, results] = await useCatch(
      this.createOrUpdateContactService.updateOne(
        { option1: { contact_uuid } },
        { ...createOrUpdateContactDto },
      ),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  @Delete(`/delete/:contact_uuid`)
  @UseGuards(JwtAuthGuard)
  async deleteOneFaq(
    @Res() res,
    @Param('contact_uuid', ParseUUIDPipe) contact_uuid: string,
  ) {
    const [errors, results] = await useCatch(
      this.createOrUpdateContactService.updateOne(
        { option1: { contact_uuid } },
        { deletedAt: new Date() },
      ),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }
}

import {
  Controller,
  Post,
  Response,
  NotFoundException,
  Body,
  Put,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { CreateOrUpdateContactService } from '../services/mutations/create-or-update-contact.service';
import { CreateOrUpdateContactDto } from '../dto/validation-contact.dto';

@Controller('contacts')
export class UpdateContactController {
  constructor(
    private readonly createOrUpdateContactService: CreateOrUpdateContactService,
  ) {}

  @Put(`/update/:contact_uuid`)
  async createOneContact(
    @Response() res: any,
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
}

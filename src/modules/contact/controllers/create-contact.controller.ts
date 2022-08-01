import {
  Controller,
  Post,
  Response,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { CreateOrUpdateContactDto } from '../dto/create-or-update-contact.dto';
import { CreateContactService } from '../services/mutations/create-contact.service';

@Controller('contacts')
export class CreateContactController {
  constructor(private readonly createContactService: CreateContactService) {}

  @Post(`/create`)
  async createOneContact(
    @Response() res: any,
    @Body() createOrUpdateContactDto: CreateOrUpdateContactDto,
  ) {
    const [errors, results] = await useCatch(
      this.createContactService.createOne({
        ...createOrUpdateContactDto,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }
}

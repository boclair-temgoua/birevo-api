import {
  Controller,
  Post,
  Response,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { CreateOrUpdateContactDto } from '../dto/validation-contact.dto';
import { CreateOrUpdateContactService } from '../services/mutations/create-or-update-contact.service';

@Controller('contacts')
export class CreateContactController {
  constructor(
    private readonly createOrUpdateContactService: CreateOrUpdateContactService,
  ) {}

  @Post(`/create`)
  async createOneContact(
    @Response() res: any,
    @Body() createOrUpdateContactDto: CreateOrUpdateContactDto,
  ) {
    const [errors, results] = await useCatch(
      this.createOrUpdateContactService.createOne({
        ...createOrUpdateContactDto,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }
}

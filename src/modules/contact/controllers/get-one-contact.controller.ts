import {
  Controller,
  Get,
  Param,
  Response,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { FindOneContactByService } from '../services/query/find-one-contact-by.service';

@Controller('contacts')
export class GetOneContactController {
  constructor(
    private readonly findOneContactByService: FindOneContactByService,
  ) {}

  @Get(`/show/:contact_uuid`)
  async getOneByUUIDContact(
    @Response() res: any,
    @Param('contact_uuid', ParseUUIDPipe) contact_uuid: string,
  ) {
    const [error, result] = await useCatch(
      this.findOneContactByService.findOneBy({
        option3: { contact_uuid },
      }),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }
}

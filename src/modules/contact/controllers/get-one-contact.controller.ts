import {
  Controller,
  Get,
  Param,
  Response,
  ParseUUIDPipe,
  NotFoundException,
  Req,
  Res,
  UseGuards,
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
    @Res() res,
    @Req() req,
    @Param('contact_uuid', ParseUUIDPipe) contact_uuid: string,
  ) {
    console.log(`req ===>>>>>>>>>>>========>`, req.user);
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

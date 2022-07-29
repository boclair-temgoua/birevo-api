import { Contact } from './../../models/Contact';
import { Controller, Get, Query, Response } from '@nestjs/common';
import { ContactService } from './contact.service';
import { reply } from '../../infrastructure/utils/reply';
import { RequestPaginationDto } from '../../infrastructure/utils/pagination';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get(`/`)
  async getAllPeople(
    @Response() res: any,
    @Query() pagination: RequestPaginationDto,
  ) {
    const results = await this.contactService.findAllContacts(pagination);

    return reply({ res, results });
  }
}

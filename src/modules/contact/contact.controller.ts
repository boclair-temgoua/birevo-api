import { Controller, Get } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get(`/`)
  async getAllContact(): Promise<any> {
    console.log('getAllContact');
    return this.contactService.getHello();
  }
}

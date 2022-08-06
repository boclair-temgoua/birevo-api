import { configurations } from '../../../infrastructure/configurations';
import {
  Controller,
  Get,
  Query,
  Response,
  NotFoundException,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { RequestPaginationDto } from '../../../infrastructure/utils/pagination';
import { FilterQueryDto } from '../../../infrastructure/utils/filter-query';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { FindContactService } from '../services/query/find-contact.service';

@Controller()
export class GetContactController {
  constructor(private readonly findContactService: FindContactService) {}

  @Get(`/`)
  async getLandingPage(@Response() res: any) {
    return reply({
      res,
      results: `Welcome to ${configurations.datasite.name}`,
    });
  }

  @Get(`/contacts`)
  async getAllContact(
    @Response() res: any,
    @Query() pagination: RequestPaginationDto,
    @Query() filterQuery: FilterQueryDto,
  ) {
    const [errors, results] = await useCatch(
      this.findContactService.findAllContacts({
        filterQuery,
        pagination,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }
}

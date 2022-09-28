// import {
//   Controller,
//   Get,
//   Param,
//   ParseUUIDPipe,
//   NotFoundException,
//   Query,
//   UseGuards,
//   Res,
// } from '@nestjs/common';
// import { reply } from '../../../infrastructure/utils/reply';
// import { useCatch } from '../../../infrastructure/utils/use-catch';
// import { FindOneFaqByService } from '../services/query/find-one-faq-by.service';
// import { FindFaqService } from '../services/query/find-faq.service';
// import { FilterQueryDto } from '../../../infrastructure/utils/filter-query';
// import { RequestPaginationDto } from '../../../infrastructure/utils/pagination';
// import { JwtAuthGuard } from '../../user/middleware';
// import { FaqTypeDto, TypeFaq } from '../dto/validation-faq.dto';
import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  NotFoundException,
  Req,
  Res,
} from '@nestjs/common';
import { RequestPaginationDto } from '../../../infrastructure/utils/pagination';
import { FilterQueryDto } from '../../../infrastructure/utils/filter-query';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { FindOneContactByService } from '../services/query/find-one-contact-by.service';
import { FindContactService } from '../services/query/find-contact.service';

@Controller('contacts')
export class GetOneOrMultipleContactController {
  constructor(
    private readonly findOneContactByService: FindOneContactByService,
    private readonly findContactService: FindContactService,
  ) {}

  @Get(`/`)
  async findAllFaqs(
    @Res() res,
    @Query() pagination: RequestPaginationDto,
    @Query() filterQuery: FilterQueryDto,
  ) {
    const [errors, results] = await useCatch(
      this.findContactService.findAll({
        filterQuery,
        pagination,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  @Get(`/show/:contact_uuid`)
  async getOneByUUIDContact(
    @Res() res,
    @Req() req,
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

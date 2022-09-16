import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { FindOneFaqByService } from '../services/query/find-one-faq-by.service';
import { FindFaqService } from '../services/query/find-faq.service';
import { FilterQueryDto } from '../../../infrastructure/utils/filter-query';
import { RequestPaginationDto } from '../../../infrastructure/utils/pagination';
import { JwtAuthGuard } from '../../user/middleware';
import { FaqTypeDto, TypeFaq } from '../dto/validation-faq.dto';

@Controller('faqs')
export class GetOneOrMultipleFaqController {
  constructor(
    private readonly findOneFaqByService: FindOneFaqByService,
    private readonly findFaqService: FindFaqService,
  ) {}

  @Get(`/`)
  async findAllFaqs(
    @Res() res,
    @Query() pagination: RequestPaginationDto,
    @Query() filterQuery: FilterQueryDto,
    @Query() faqTypeDto: FaqTypeDto,
  ) {
    const [errors, results] = await useCatch(
      this.findFaqService.findAll({
        filterQuery,
        pagination,
        type: faqTypeDto?.type,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  @Get(`/show/:faq_uuid`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUIDFaq(
    @Res() res,
    @Param('faq_uuid', ParseUUIDPipe) faq_uuid: string,
  ) {
    const [error, result] = await useCatch(
      this.findOneFaqByService.findOneBy({
        option1: { faq_uuid },
      }),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }
}

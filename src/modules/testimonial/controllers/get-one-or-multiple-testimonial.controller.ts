import {
  Controller,
  Get,
  Param,
  Response,
  ParseUUIDPipe,
  NotFoundException,
  Query,
  UseGuards,
  ParseIntPipe,
  Req,
  Res,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { FindOneTestimonialByService } from '../services/query/find-one-testimonial-by.service';
import { FindTestimonialService } from '../services/query/find-testimonial.service';
import { FilterQueryDto } from '../../../infrastructure/utils/filter-query';
import { RequestPaginationDto } from '../../../infrastructure/utils/pagination';
import { JwtAuthGuard } from '../../user/middleware';

@Controller('Testimonials')
export class GetOneOrMultipleTestimonialController {
  constructor(
    private readonly findTestimonialService: FindTestimonialService,
  ) {}

  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAllTestimonialsByUser(
    @Res() res,
    @Req() req,
    @Query() pagination: RequestPaginationDto,
    @Query() filterQuery: FilterQueryDto,
  ) {
    const { user } = req;
    const [errors, results] = await useCatch(
      this.findTestimonialService.findAll({
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

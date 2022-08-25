import {
  Controller,
  Get,
  NotFoundException,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { JwtAuthGuard } from '../../user/middleware';
import { FindCurrencyService } from '../services/query/find-currency.service';
import { FilterQueryDto } from '../../../infrastructure/utils/filter-query/filter-query.dto';

@Controller('currencies')
export class GetOneOrMultipleCurrencyController {
  constructor(private readonly findCurrencyService: FindCurrencyService) {}

  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async getCurrencies(@Res() res, @Query() filterQuery: FilterQueryDto) {
    const [error, results] = await useCatch(
      this.findCurrencyService.findAllCurrencies({ filterQuery }),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results });
  }
}

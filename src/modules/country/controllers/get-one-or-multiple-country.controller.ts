import { Controller, Get, NotFoundException, Res, Query } from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { FilterQueryDto } from '../../../infrastructure/utils/filter-query/filter-query.dto';
import { FindCountryService } from '../services/query/find-country.service';

@Controller('countries')
export class GetOneOrMultipleCountryController {
  constructor(private readonly findCountryService: FindCountryService) {}

  @Get(`/`)
  async getCountries(@Res() res, @Query() filterQuery: FilterQueryDto) {
    const [error, results] = await useCatch(
      this.findCountryService.findAll({ filterQuery }),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results });
  }
}

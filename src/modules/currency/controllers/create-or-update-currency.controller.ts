import {
  Controller,
  Post,
  Response,
  NotFoundException,
  Body,
  Put,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { CreateOrUpdateCurrencyService } from '../services/mutations/create-or-update-currency.service';
import { CreateOrUpdateCurrencyDto } from '../dto/create-or-update-currency.dto';

@Controller('currency')
export class CreateOrUpdateCurrencyController {
  constructor(
    private readonly createOrUpdateCurrencyService: CreateOrUpdateCurrencyService,
  ) {}

  @Post(`/create`)
  async createOneCurrency(
    @Response() res: any,
    @Body() createOrUpdateCurrencyDto: CreateOrUpdateCurrencyDto,
  ) {
    const [errors, results] = await useCatch(
      this.createOrUpdateCurrencyService.createOne({
        ...createOrUpdateCurrencyDto,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  @Put(`/update/:currencyId`)
  async updateOneCurrency(
    @Response() res: any,
    @Body() createOrUpdateCurrencyDto: CreateOrUpdateCurrencyDto,
    @Param('currencyId', ParseIntPipe) currencyId: number,
  ) {
    const [errors, results] = await useCatch(
      this.createOrUpdateCurrencyService.updateOne(
        { option1: { currencyId } },
        { ...createOrUpdateCurrencyDto },
      ),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }
}

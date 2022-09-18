import {
  Controller,
  Post,
  Response,
  NotFoundException,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { JwtAuthGuard } from '../../user/middleware';

import { CreateOrUpdateFaqDto } from '../dto/validation-faq.dto';
import { CreateOrUpdateFaq } from '../services/use-cases';

@Controller('faqs')
export class CreateOrUpdateFaqController {
  constructor(private readonly createOrUpdateFaq: CreateOrUpdateFaq) {}

  @Post(`/create-or-update`)
  @UseGuards(JwtAuthGuard)
  async createOneFaq(
    @Response() res: any,
    @Request() req: any,
    @Body() createOrUpdateFaqDto: CreateOrUpdateFaqDto,
  ) {
    const { user } = req;
    const [errors, results] = await useCatch(
      this.createOrUpdateFaq.createOrUpdate({
        ...createOrUpdateFaqDto,
        user,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  @Delete(`/delete/:faq_uuid`)
  @UseGuards(JwtAuthGuard)
  async deleteOneFaq(
    @Response() res: any,
    @Param('faq_uuid', ParseUUIDPipe) faq_uuid: string,
  ) {
    const [errors, results] = await useCatch(
      this.createOrUpdateFaq.deleteOne({ faq_uuid }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }
}

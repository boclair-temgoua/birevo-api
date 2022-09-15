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

import { CreateOrUpdateTestimonialDto } from '../dto/validation-testimonial.dto';
import { CreateOrUpdateTestimonial } from '../services/use-cases';
import { CreateOrUpdateTestimonialService } from '../services/mutations/create-or-update-testimonial.service';

@Controller('Testimonials')
export class CreateOrUpdateTestimonialController {
  constructor(
    private readonly createOrUpdateTestimonial: CreateOrUpdateTestimonial,
    private readonly createOrUpdateTestimonialService: CreateOrUpdateTestimonialService,
  ) {}

  @Post(`/create-or-update`)
  @UseGuards(JwtAuthGuard)
  async createOneTestimonial(
    @Response() res: any,
    @Request() req: any,
    @Body() createOrUpdateTestimonialDto: CreateOrUpdateTestimonialDto,
  ) {
    const { user } = req;
    const [errors, results] = await useCatch(
      this.createOrUpdateTestimonial.createOrUpdate({
        ...createOrUpdateTestimonialDto,
        user,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  @Delete(`/delete/:testimonial_uuid`)
  @UseGuards(JwtAuthGuard)
  async deleteOneTestimonial(
    @Response() res: any,
    @Param('testimonial_uuid', ParseUUIDPipe) testimonial_uuid: string,
  ) {
    const [errors, results] = await useCatch(
      this.createOrUpdateTestimonialService.updateOne(
        { option1: { testimonial_uuid } },
        { deletedAt: new Date() },
      ),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }
}

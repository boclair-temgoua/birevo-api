import {
  Controller,
  Post,
  Response,
  NotFoundException,
  Body,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { CreateMethodBulling } from '../services/user-cases/create-method-bulling';
import {
  CreateCouponBullingDto,
  CreateStripeBullingDto,
} from '../dto/validation-bulling.dto';
import { JwtAuthGuard } from '../../user/middleware/jwt-auth.guard';

@Controller('billings')
export class CreateContactController {
  constructor(private readonly createMethodBulling: CreateMethodBulling) {}

  @Post(`/stripe/create`)
  @UseGuards(JwtAuthGuard)
  async createOneStripe(
    @Res() res,
    @Req() req,
    @Body() createStripeBullingDto: CreateStripeBullingDto,
  ) {
    const [errors, results] = await useCatch(
      this.createMethodBulling.stripeMethod({
        ...createStripeBullingDto,
        user: req?.user,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  @Post(`/coupon/create`)
  @UseGuards(JwtAuthGuard)
  async createOneCoupon(
    @Res() res,
    @Req() req,
    @Body() createCouponBullingDto: CreateCouponBullingDto,
  ) {
    const [errors, results] = await useCatch(
      this.createMethodBulling.couponMethod({
        ...createCouponBullingDto,
        user: req?.user,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }
}

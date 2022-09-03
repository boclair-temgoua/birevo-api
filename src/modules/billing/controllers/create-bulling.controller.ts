import {
  Controller,
  Post,
  NotFoundException,
  Body,
  UseGuards,
  Req,
  Res,
  Headers,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { CreateMethodBulling } from '../services/user-cases/create-method-bulling';
import {
  CreateCouponBullingDto,
  CreatePayPalBullingDto,
  CreateStripeBullingDto,
} from '../dto/validation-bulling.dto';
import { JwtAuthGuard } from '../../user/middleware/jwt-auth.guard';
import { getIpRequest } from '../../../infrastructure/utils/commons/get-ip-request';

@Controller('billings')
export class CreateContactController {
  constructor(private readonly createMethodBulling: CreateMethodBulling) {}

  /** Stripe controller send */
  @Post(`/stripe/create`)
  @UseGuards(JwtAuthGuard)
  async createOneStripe(
    @Res() res,
    @Req() req,
    @Body() createStripeBullingDto: CreateStripeBullingDto,
    @Headers('User-Agent') userAgent: string,
  ) {
    const [errors, results] = await useCatch(
      this.createMethodBulling.stripeMethod({
        ...createStripeBullingDto,
        ipLocation: getIpRequest(req),
        user: req?.user,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  /** PayPal controller send */
  @Post(`/paypal/create`)
  @UseGuards(JwtAuthGuard)
  async createOnePaypal(
    @Res() res,
    @Req() req,
    @Body() createPayPalBullingDto: CreatePayPalBullingDto,
    @Headers('User-Agent') userAgent: string,
  ) {
    const [errors, results] = await useCatch(
      this.createMethodBulling.paypalMethod({
        ...createPayPalBullingDto,
        ipLocation: getIpRequest(req),
        user: req?.user,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  /** Coupon controller send */
  @Post(`/coupon/create`)
  @UseGuards(JwtAuthGuard)
  async createOneCoupon(
    @Res() res,
    @Req() req,
    @Body() createCouponBullingDto: CreateCouponBullingDto,
    @Headers('User-Agent') userAgent: string,
  ) {
    const [errors, results] = await useCatch(
      this.createMethodBulling.couponMethod({
        ...createCouponBullingDto,
        ipLocation: getIpRequest(req),
        user: req?.user,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }
}

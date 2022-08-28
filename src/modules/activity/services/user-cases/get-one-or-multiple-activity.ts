import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  CreateOrUpdateActivityDto,
  GetMultipleActivityDto,
} from '../../dto/validation-activity.dto';
import { CreateOrUpdateActivityService } from '../mutations/create-or-update-activity.service';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { FindActivityService } from '../query/find-activity.service';
import { FindOneVoucherByService } from '../../../voucher/services/query/find-one-voucher-by.service';
import { RequestPaginationDto } from '../../../../infrastructure/utils/pagination/request-pagination.dto';
import { FilterQueryDto } from '../../../../infrastructure/utils/filter-query/filter-query.dto';
@Injectable()
export class GetOneOrMultipleActivity {
  constructor(
    private readonly findActivityService: FindActivityService,
    private readonly findOneVoucherByService: FindOneVoucherByService,
  ) {}

  async execute(
    options: GetMultipleActivityDto & RequestPaginationDto,
  ): Promise<any> {
    const { voucher_uuid, organizationId, limit, page, sort, user } = {
      ...options,
    };

    if (voucher_uuid) {
      const [error, voucher] = await useCatch(
        this.findOneVoucherByService.findOneBy({
          option1: { uuid: voucher_uuid },
        }),
      );
      if (error) {
        throw new NotFoundException(error);
      }

      const [errors, activity] = await useCatch(
        this.findActivityService.findAllActivities({
          pagination: { page, limit, sort },
          option1: {
            activityAbleType: voucher?.voucherType,
            activityAbleId: voucher?.id,
          },
        }),
      );
      if (errors) {
        throw new NotFoundException(errors);
      }

      return activity;
    }

    if (organizationId) {
      const [errors, activity] = await useCatch(
        this.findActivityService.findAllActivities({
          pagination: { page, limit, sort },
          option2: { organizationId: user?.organizationInUtilizationId },
        }),
      );
      if (errors) {
        throw new NotFoundException(errors);
      }

      return activity;
    }
  }
}

import {
  Controller,
  Get,
  Query,
  Response,
  NotFoundException,
} from '@nestjs/common';
import { reply } from '../../../../infrastructure/utils/reply';
import { RequestPaginationDto } from '../../../../infrastructure/utils/pagination';
import { FilterQueryDto } from '../../../../infrastructure/utils/filter-query';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { FindUserService } from '../../services/query/find-user.service';

@Controller()
export class GetUsersController {
  constructor(private readonly findUserService: FindUserService) {}

  @Get(`/users`)
  async getAllContact(
    @Response() res: any,
    @Query() pagination: RequestPaginationDto,
    @Query() filterQuery: FilterQueryDto,
  ) {
    const [errors, results] = await useCatch(
      this.findUserService.findAllUsers({
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

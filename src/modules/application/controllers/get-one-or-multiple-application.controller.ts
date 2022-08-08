import {
  Controller,
  Get,
  Param,
  Response,
  ParseUUIDPipe,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { FindOneApplicationByService } from '../services/query/find-one-application-by.service';
import { FindApplicationService } from '../services/query/find-application.service';
import { FilterQueryDto } from '../../../infrastructure/utils/filter-query';
import { RequestPaginationDto } from '../../../infrastructure/utils/pagination';
import { JwtAuthGuard } from '../../user/services/middleware';

@Controller('applications')
export class GetOneOrMultipleApplicationController {
  constructor(
    private readonly findOneApplicationByService: FindOneApplicationByService,
    private readonly findApplicationService: FindApplicationService,
  ) {}

  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAllApplicationsByUser(
    @Response() res: any,
    @Query() pagination: RequestPaginationDto,
    @Query() filterQuery: FilterQueryDto,
  ) {
    const [errors, results] = await useCatch(
      this.findApplicationService.findAllApplications({
        option1: { userId: 1 },
        filterQuery,
        pagination,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  @Get(`/show/:application_uuid`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUIDApplication(
    @Response() res: any,
    @Param('application_uuid', ParseUUIDPipe) application_uuid: string,
  ) {
    const [error, result] = await useCatch(
      this.findOneApplicationByService.findOneBy({
        option1: { application_uuid },
      }),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }
}

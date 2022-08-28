import {
  Controller,
  Get,
  Query,
  Response,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { reply } from '../../../../infrastructure/utils/reply';
import { RequestPaginationDto } from '../../../../infrastructure/utils/pagination';
import { FilterQueryDto } from '../../../../infrastructure/utils/filter-query';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { FindUserService } from '../../services/query/find-user.service';
import { FindOneUserByService } from '../../services/query/find-one-user-by.service';
import { JwtAuthGuard } from '../../middleware/jwt-auth.guard';
import { FindOneProfileByService } from '../../../profile/services/query/find-one-profile-by.service';

@Controller('users')
export class GetOneOrMultipleUsersController {
  constructor(
    private readonly findUserService: FindUserService,
    private readonly findOneProfileByService: FindOneProfileByService,
    private readonly findOneUserByService: FindOneUserByService,
  ) {}

  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async getAllUsers(
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

  @Get(`/show/:user_uuid`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUIDUser(
    @Res() res,
    @Param('user_uuid', ParseUUIDPipe) user_uuid: string,
  ) {
    const [error, result] = await useCatch(
      this.findOneUserByService.findOneInfoBy({
        option4: { user_uuid },
      }),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }

  @Get(`/profile/show/:profileId`)
  @UseGuards(JwtAuthGuard)
  async getOneByProfileId(
    @Response() res: any,
    @Param('profileId', ParseIntPipe) profileId: number,
  ) {
    const [error, result] = await useCatch(
      this.findOneProfileByService.findOneBy({ option1: { profileId } }),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }
}

import {
  Controller,
  Get,
  Param,
  Response,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { reply } from '../../../../infrastructure/utils/reply';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { FindOneUserByService } from '../../services/query/find-one-user-by.service';

@Controller('users')
export class GetOneUserController {
  constructor(private readonly findOneUserByService: FindOneUserByService) {}

  @Get(`/show/:user_uuid`)
  async getOneByUUIDContact(
    @Response() res: any,
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
}

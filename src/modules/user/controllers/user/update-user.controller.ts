import {
  Controller,
  Get,
  Param,
  Response,
  ParseUUIDPipe,
  NotFoundException,
  Put,
  Body,
} from '@nestjs/common';
import { reply } from '../../../../infrastructure/utils/reply';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { FindOneUserByService } from '../../services/query/find-one-user-by.service';
import { CreateOrUpdateUserService } from '../../services/mutations/create-or-update-user.service';
import { UpdateInfoUserDto } from '../../dto/validation-user.dto';

@Controller('users')
export class UpdateContactController {
  constructor(
    private readonly createOrUpdateUserService: CreateOrUpdateUserService,
  ) {}

  @Put(`/update/:user_uuid`)
  async createOneContact(
    @Response() res: any,
    @Body() updateInfoUserDto: UpdateInfoUserDto,
    @Param('user_uuid', ParseUUIDPipe) user_uuid: string,
  ) {
    const [errors, results] = await useCatch(
      this.createOrUpdateUserService.updateOne(
        { option4: { user_uuid } },
        { ...updateInfoUserDto },
      ),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }
}

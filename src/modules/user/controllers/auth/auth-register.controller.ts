import { CreateOrUpdateProfileService } from './../../../profile/services/mutations/create-or-update-profile.service';
import {
  Controller,
  Post,
  Response,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { reply } from '../../../../infrastructure/utils/reply';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateOrUpdateUserService } from '../../services/mutations/create-or-update-user.service';
import { CreateRegisterUserService } from '../../services/mutations/create-register-user.service';
import { CreateOrRegisterUserDto } from '../../dto/create-or-register-user.dto';

@Controller()
export class AuthRegisterController {
  constructor(
    private readonly createRegisterUserService: CreateRegisterUserService,
  ) {}

  @Post(`/register`)
  async createOneContact(
    @Response() res: any,
    @Body() createOrRegisterUserDto: CreateOrRegisterUserDto,
  ) {
    const [errors, results] = await useCatch(
      this.createRegisterUserService.createOneRegister({
        ...createOrRegisterUserDto,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }
}

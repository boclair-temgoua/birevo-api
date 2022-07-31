import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

export const UserErrors = {
  forbidden: (): ForbiddenException => new ForbiddenException(),
  unauthorized: (): UnauthorizedException => new UnauthorizedException(),
};

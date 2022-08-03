import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateOrUpdateResetPasswordService } from './services/mutations/create-or-update-reset-password.service';
import { FindOneResetPasswordByService } from './services/query/find-one-reset-password-by.service';
import { ResetPassword } from '../../models/ResetPassword';

@Module({
  imports: [TypeOrmModule.forFeature([ResetPassword])],
  controllers: [],
  providers: [
    CreateOrUpdateResetPasswordService,
    FindOneResetPasswordByService,
  ],
})
export class ProfileModule {}

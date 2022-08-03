import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../../models/Profile';
import { CreateOrUpdateResetPasswordService } from './services/mutations/create-or-update-reset-apssword.service';
import { FindOneResetPasswordByService } from './services/query/find-one-reset-password-by.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [],
  providers: [
    CreateOrUpdateResetPasswordService,
    FindOneResetPasswordByService,
  ],
})
export class ProfileModule {}

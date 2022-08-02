import { Controller, Get, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../../models/Profile';
import { CreateOrUpdateProfileService } from './services/mutations/create-or-update-profile.service';
import { FindOneProfileByService } from './services/query/find-one-profile-by.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [],
  providers: [CreateOrUpdateProfileService, FindOneProfileByService],
})
export class ProfileModule {}

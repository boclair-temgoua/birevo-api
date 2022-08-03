import { Controller, Get, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../../models/Organization';
import { CreateOrUpdateOrganizationService } from './services/mutations/create-or-update-organization.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  controllers: [],
  providers: [CreateOrUpdateOrganizationService],
})
export class OrganizationModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../../models/Organization';
import { CreateOrUpdateOrganizationService } from './services/mutations/create-or-update-organization.service';
import { FindOneOrganizationByService } from './services/query/find-one-organization-by.service';
import { GetOneOrMultipleOrganizationController } from './controllers/get-one-or-multiple-organization.controller';
import { UpdateOrganizationController } from './controllers/update-organization.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  controllers: [
    GetOneOrMultipleOrganizationController,
    UpdateOrganizationController,
  ],
  providers: [CreateOrUpdateOrganizationService, FindOneOrganizationByService],
})
export class OrganizationModule {}

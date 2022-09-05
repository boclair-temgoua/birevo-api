import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from '../../models/Country';
import { CreateOrUpdateCountryService } from './services/mutations/create-or-update-country.service';
import { FindOneCountryByService } from './services/query/find-one-country-by.service';
import { FindCountryService } from './services/query/find-country.service';
import { GetOneOrMultipleCountryController } from './controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [GetOneOrMultipleCountryController],
  providers: [
    FindCountryService,
    CreateOrUpdateCountryService,
    FindOneCountryByService,
  ],
})
export class CountryModule {}

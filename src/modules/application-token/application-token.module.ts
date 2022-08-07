import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationToken } from '../../models/ApplicationToken';
import { CreateOrUpdateApplicationTokenService } from './services/mutations/create-or-update-application-token.service';
import { FindOneApplicationTokenByService } from './services/query/find-one-application-token-by.service';
import { FindApplicationTokenService } from './services/query/find-application-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationToken])],
  controllers: [],
  providers: [
    FindApplicationTokenService,
    CreateOrUpdateApplicationTokenService,
    FindOneApplicationTokenByService,
  ],
})
export class ApplicationTokenModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from '../../models/Faq';
import { FindOneFaqByService } from './services/query/find-one-faq-by.service';
import {
  CreateOrUpdateFaqController,
  GetOneOrMultipleFaqController,
} from './controllers';
import { FindFaqService } from './services/query/find-faq.service';
import { CreateOrUpdateFaqService } from './services/mutations/create-or-update-faq.service';
import { CreateOrUpdateFaq } from './services/use-cases';

@Module({
  imports: [TypeOrmModule.forFeature([Faq])],
  controllers: [CreateOrUpdateFaqController, GetOneOrMultipleFaqController],
  providers: [
    /** Imports providers query */
    FindOneFaqByService,
    FindFaqService,

    /** Imports providers mutations */
    CreateOrUpdateFaqService,

    /** Imports providers use-cases */
    CreateOrUpdateFaq,
  ],
})
export class FaqModule {}

import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateOrUpdateFaqService } from '../mutations/create-or-update-faq.service';
import { CreateOrUpdateFaqDto } from '../../dto/validation-faq.dto';
import { FindOneFaqByService } from '../query/find-one-faq-by.service';

@Injectable()
export class CreateOrUpdateFaq {
  constructor(
    private readonly createOrUpdateFaqService: CreateOrUpdateFaqService,
    private readonly findOneFaqByService: FindOneFaqByService,
  ) {}

  /** Create one Faq Or Update to the database. */
  async createOrUpdate(options: CreateOrUpdateFaqDto): Promise<any> {
    const { faq_uuid, title, status, description, user } = { ...options };

    if (faq_uuid) {
      const [error, findFaq] = await useCatch(
        this.findOneFaqByService.findOneBy({
          option1: { faq_uuid },
        }),
      );
      if (error) {
        throw new NotFoundException(error);
      }
      if (!findFaq)
        throw new HttpException(`Faq invalid or expired`, HttpStatus.NOT_FOUND);
      const [errorUpdate, update] = await useCatch(
        this.createOrUpdateFaqService.updateOne(
          { option1: { faq_uuid } },
          { title, status, description },
        ),
      );
      if (errorUpdate) {
        throw new NotFoundException(errorUpdate);
      }

      return update;
    } else {
      const [_errorSave, faq] = await useCatch(
        this.createOrUpdateFaqService.createOne({
          title,
          description,
          userId: user?.organizationInUtilization?.userId,
          userCreatedId: user?.id,
        }),
      );
      if (_errorSave) {
        throw new NotFoundException(_errorSave);
      }
      return faq;
    }
  }

  /** Delete one Faq to the database. */
  async deleteOne(options: { faq_uuid: string }): Promise<any> {
    const { faq_uuid } = { ...options };
    const [error, findFaq] = await useCatch(
      this.findOneFaqByService.findOneBy({
        option1: { faq_uuid },
      }),
    );
    if (error) {
      throw new NotFoundException(error);
    }
    if (!findFaq)
      throw new HttpException(`Faq invalid or expired`, HttpStatus.NOT_FOUND);

    /** Delete one Faq */
    const [_error, _] = await useCatch(
      this.createOrUpdateFaqService.updateOne(
        { option1: { faq_uuid } },
        { deletedAt: new Date() },
      ),
    );
    if (_error) {
      throw new NotFoundException(_error);
    }

    return findFaq;
  }
}

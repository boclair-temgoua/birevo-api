import { Contact } from './../../../models/Contact';
import { SortType } from '../../../infrastructure/utils/pagination/request-pagination.dto';

export type GetContactsSelections = {
  filterQuery?: any;
  data?: any[];
  pagination?: {
    sort: SortType;
    page: number;
    limit: number;
  };
};

export type GetOneContactSelections = {
  option1?: { contactId: Contact['id'] };
  option2?: { contact_slug: Contact['slug'] };
  option3?: { contact_uuid: Contact['uuid'] };
};

export type UpdateContactSelections = {
  option1?: {
    contact_uuid: Contact['uuid'];
  };
};

export type CreateContactOptions = Partial<Contact>;

export type UpdateContactOptions = Partial<Contact>;

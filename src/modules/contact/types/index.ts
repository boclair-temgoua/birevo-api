import { Contact } from './../../../models/Contact';

export type GetContactsSelections = {
  filterQuery?: any;
  data?: any[];
  pagination?: {
    page: number;
    limit: number;
  };
};

export type GetOneContactSelections = {
  option1?: { contactId: Contact['id'] };
  option2?: { contact_slug: Contact['slug'] };
  option3?: { contact_uuid: Contact['uuid'] };
};

export type CreateContactOptions = Partial<Contact>;

export type UpdateContactOptions = Partial<Contact>;

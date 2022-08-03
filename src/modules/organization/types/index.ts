import { Organization } from '../../../models/Organization';

export type GetOneOrganizationSelections = {
  option1?: {
    organizationId?: Organization['id'];
  };
};

export type UpdateOrganizationSelections = {
  option1?: {
    organizationId?: Organization['id'];
  };
};

export type CreateOrganizationOptions = Partial<Organization>;

export type UpdateOrganizationOptions = Partial<Organization>;

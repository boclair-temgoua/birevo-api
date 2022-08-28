import { Organization } from '../../../models/Organization';

export type GetOneOrganizationSelections = {
  option1?: {
    organizationId?: Organization['id'];
  };
  option2?: {
    organization_uuid?: Organization['uuid'];
  };
};

export type UpdateOrganizationSelections = {
  option1?: {
    organizationId?: Organization['id'];
  };
  option2?: {
    organization_uuid?: Organization['uuid'];
  };
};

export type CreateOrganizationOptions = Partial<Organization>;

export type UpdateOrganizationOptions = Partial<Organization>;

import { Country } from '../../../models/Country';

export type GetCurrenciesSelections = {
  filterQuery?: any;
};

export type GetOneCountrySelections = {
  option1?: { countryId?: Country['id'] };
  option2?: { code?: Country['code'] };
};

export type UpdateCountrySelections = {
  option1?: { countryId?: Country['id'] };
};

export type CreateCountryOptions = Partial<Country>;

export type UpdateCountryOptions = Partial<Country>;

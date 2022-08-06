import { Currency } from '../../../models/Currency';

export type GetCurrenciesSelections = {
  filterQuery?: any;
};

export type GetOneCurrencySelections = {
  option1?: {
    currencyId?: Currency['id'];
  };
};

export type UpdateCurrencySelections = {
  option1?: {
    currencyId?: Currency['id'];
  };
};

export type CreateCurrencyOptions = Partial<Currency>;

export type UpdateCurrencyOptions = Partial<Currency>;

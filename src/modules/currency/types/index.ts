import { Currency } from '../../../models/Currency';
import { CreateOrUpdateCurrencyDto } from '../dto/validation-currency.dto';

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

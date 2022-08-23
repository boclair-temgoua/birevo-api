import { Voucher } from '../../../models/Voucher';
import { User } from '../../../models/User';
import { VoucherableType } from '../dto/validation-voucher.dto';
import { SortType } from '../../../infrastructure/utils/pagination';

export type GetVoucherSelections = {
  option1?: { userId: Voucher['userId'] };
  type: VoucherableType;
  is_paginate: boolean;
  status?: number;
  filterQuery?: any;
  data?: any[];
  pagination?: {
    sort: SortType;
    page: number;
    limit: number;
  };
};

export type GetOneVoucherSelections = {
  option1?: { uuid: Voucher['uuid'] };
  option2?: { code: Voucher['code'] };
  option3?: {
    code: Voucher['code'];
    type?: Voucher['voucherType'];
    organizationId: Voucher['organizationId'];
  };
  option4?: { id: Voucher['id'] };
  option5?: {
    code: Voucher['code'];
    organizationId: Voucher['organizationId'];
  };
  option6?: {
    code: Voucher['code'];
    type: Voucher['voucherType'];
  };
};

export type UpdateVoucherSelections = {
  option1?: { uuid: Voucher['uuid'] };
};

export type CreateVoucherOptions = Partial<Voucher>;
export type UpdateVoucherOptions = Partial<Voucher>;

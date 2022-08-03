import { ResetPassword } from '../../../models/ResetPassword';

export type GetOneResetPasswordSelections = {
  option1?: {
    token: ResetPassword['token'];
  };
};

export type UpdateResetPasswordSelections = {
  option1?: {
    token: ResetPassword['token'];
  };
};

export type UpdateResetPasswordOptions = Partial<ResetPassword>;

export type CreateResetPasswordOptions = Partial<ResetPassword>;

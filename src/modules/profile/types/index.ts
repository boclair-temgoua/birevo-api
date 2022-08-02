import { Profile } from '../../../models/Profile';

export type GetOneProfileSelections = {
  option1?: {
    profileId?: Profile['id'];
  };
};

export type UpdateProfileSelections = {
  option1?: {
    profileId?: Profile['id'];
  };
};

export type CreateProfileOptions = Partial<Profile>;

export type UpdateProfileOptions = Partial<Profile>;

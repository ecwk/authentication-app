import { Profile } from '../../users/types';

export type RegisterDto = {
  email: string;
  password: string;
  profile?: Profile;
};

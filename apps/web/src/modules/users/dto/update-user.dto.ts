export type UpdateUserDto = {
  email?: string;
  password?: string;
  profile?: {
    name?: string;
    bio?: string;
    phone?: string;
  };
};

export type User = {
  id: string;
  email: string;
  password: undefined;
  profile: Profile;
};

export type Profile = {
  name?: string;
  profilePicture?: string;
  bio?: string;
  phone?: string;
};

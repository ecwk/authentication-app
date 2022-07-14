import { Avatar, AvatarProps } from '@chakra-ui/react';

import { User } from '../types';

type ProfileAvatarProps = AvatarProps & {
  user?: User | null | undefined;
};

export const ProfileAvatar = ({ user, ...rest }: ProfileAvatarProps) => {
  return (
    <Avatar
      name={user?.profile?.name || undefined}
      src={user?.profile?.profilePicture || undefined}
      borderRadius="lg"
      {...rest}
    />
  );
};

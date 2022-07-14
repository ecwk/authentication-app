import { Flex, Text, FlexProps, IconButton } from '@chakra-ui/react';

import { Google, Github } from 'src/assets';
import { configuration } from 'src/config';
import { useRouter } from 'next/router';

const { apiUrl } = configuration;
const oAuthProviders = {
  google: `${apiUrl}/api/oauth/google`,
  github: `${apiUrl}/api/oauth/github`
};

const useFetchOAuthToken = () => {
  const router = useRouter();
  return (url: string) => {
    const win = window.open(url, '_blank', 'popup=yes, width=600, height=800');
    if (win) {
      setInterval(() => {
        if (win.closed) {
          router.reload();
        }
      }, 200);
    }
  };
};

export const OAuthForm = (props: FlexProps) => {
  const fetchOAuthToken = useFetchOAuthToken();

  return (
    <Flex flexDir="column" alignItems="center" {...props}>
      <Text color="gray" fontSize="sm">
        or continue with these social profiles
      </Text>
      <Flex mt={5} justifyContent="space-between" gap={5} marginX="auto">
        <IconButton
          onClick={() => {
            fetchOAuthToken(oAuthProviders.google);
          }}
          icon={<Google />}
          borderRadius="100%"
          variant="ghost"
          aria-label="Sign in with Google"
        ></IconButton>
        <IconButton
          onClick={() => {
            fetchOAuthToken(oAuthProviders.github);
          }}
          icon={<Github />}
          borderRadius="100%"
          variant="ghost"
          aria-label="Sign in with Github"
        ></IconButton>
      </Flex>
    </Flex>
  );
};

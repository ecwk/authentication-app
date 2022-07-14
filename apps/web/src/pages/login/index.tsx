import {
  Center,
  Flex,
  Heading,
  Text,
  Link,
  CenterProps
} from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import type { NextPage } from 'next';

import { LoginForm, OAuthForm } from 'src/modules/auth/components';
import { Logo } from 'src/components';

const Login: NextPage = () => {
  return (
    <Center>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login page" />
      </Head>
      <Flex {...styles.container}>
        <Logo />
        <Heading size="md" fontWeight="600" mt={8}>
          Login
        </Heading>
        <LoginForm mt={8} />
        <OAuthForm mt={8} />
        <Text color="gray" textAlign="center" fontSize="sm" mt={8}>
          Don't have an account yet?{' '}
          <NextLink href="/register">
            <Link color="blue.400">Register</Link>
          </NextLink>
        </Text>
      </Flex>
    </Center>
  );
};

const styles = {
  container: {
    mt: '30px',
    p: 12,
    borderRadius: '3xl',
    flexDir: 'column',
    border: '1px solid',
    borderColor: 'brandLightGray',
    width: '100%',
    maxW: '500px',
    mx: 8,
    mb: 20
  } as CenterProps
};

export default Login;

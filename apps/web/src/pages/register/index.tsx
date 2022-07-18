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

import { RegisterForm, OAuthForm } from 'src/modules/auth/components';
import { Logo } from 'src/components';

const Register: NextPage = () => {
  return (
    <Center>
      <Head>
        <title>Register</title>
        <meta name="description" content="Register account page" />
      </Head>
      <Flex {...styles.container}>
        <Logo />
        <Heading size="md" fontWeight="600" mt={8} maxW="320px">
          Join thousands of learners from around the world
        </Heading>
        <Text mt={4} maxW="320px">
          Master web development by making real-life projects. There are
          multiple paths for you to choose
        </Text>
        <RegisterForm mt={8} />
        <OAuthForm mt={8} />
        <Text color="gray" textAlign="center" fontSize="sm" mt={8}>
          Already a member?{' '}
          <NextLink href="/login">
            <Link color="blue.400">Login</Link>
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

export default Register;

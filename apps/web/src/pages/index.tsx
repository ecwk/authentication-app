import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import Head from 'next/head';
import { NextPage } from 'next';
import NextLink from 'next/link';

import { useAuth } from 'src/modules/auth/hooks';

const Home: NextPage = () => {
  const { user } = useAuth();
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      width="100%"
      mt="50px"
      px={8}
      mb={20}
    >
      <Head>
        <title>Home</title>
        <meta name="description" content="Home page" />
      </Head>
      <Heading size="4xl">Home Page</Heading>
      <Flex
        flexDir="column"
        p={10}
        mt={5}
        width="100%"
        maxW="700px"
        height="500px"
        backgroundColor={useColorModeValue('white', 'gray.700')}
        borderRadius="2xl"
        boxShadow={useColorModeValue(
          '1px 1px 10px 2px rgba(0, 0, 0, 0.1)',
          '1px 1px 10px 2px rgba(0, 0, 0, 0.3)'
        )}
        justifyContent="center"
      >
        <Text textAlign="center" fontSize="xl">
          The most ordinary authentication web app.
          <br />
          <br />
          Built with NestJS, NextJS and Chakra UI
        </Text>
        <Box mx="auto" mt={8}>
          <NextLink href="/register">
            <Button size="lg" isDisabled={!!user}>
              {user ? 'Logged In 😊' : 'Get Started'}
            </Button>
          </NextLink>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Home;

import Head from 'next/head';
import NextLink from 'next/link';
import { darken } from 'polished';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { MdArrowBackIos } from 'react-icons/md';
import { GetServerSideProps, NextPage } from 'next';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';

import { EditForm } from 'src/modules/users/components';
import { usersApiServer } from 'src/modules/users/api';
import { useAuth } from 'src/modules/auth/hooks';
import { User } from 'src/modules/users/types';

type EditUserProps = {
  user: User | null;
};

const EditUser: NextPage<EditUserProps> = ({ user }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const userId = router.query.userid;

  return (
    <Flex flexDir="column" alignItems="center" mx={{ base: 0, md: 8 }}>
      <Head>
        <title>
          Edit - {user?.profile?.name || user?.email || 'User Profile'}
        </title>
        <meta
          name="description"
          content="Page to edit a user's public information"
        />
      </Head>
      <Box width="100%" maxW="850px" mb={20}>
        <NextLink href={`/users/${userId}`}>
          <Button
            onClick={() => {
              setLoading(true);
            }}
            isLoading={loading}
            variant="unstyled"
            ml={{
              base: 10,
              md: 0
            }}
          >
            <Flex
              alignItems="center"
              color="#2D9CDB"
              _hover={{
                color: darken(0.15, '#2D9CDB'),
                transition: '0.2s'
              }}
              _active={{
                color: darken(0.4, '#2D9CDB')
              }}
            >
              <MdArrowBackIos />
              <Text fontSize="18px" fontWeight="normal" as="span" mt="-2px">
                Back
              </Text>
            </Flex>
          </Button>
        </NextLink>
        <Flex
          flexDir="column"
          border={{
            base: 'none',
            md: '1px solid #E0E0E0'
          }}
          borderRadius="xl"
          py={8}
          px={10}
          mt={2}
        >
          <Heading fontSize="24px" fontWeight="400">
            {user ? 'Change Info' : 'This user does not exist'}
          </Heading>
          <Text mt={2} color="#828282">
            Changes will be reflected to every service
          </Text>
          <EditForm user={user as User} />
        </Flex>
      </Box>
    </Flex>
  );
};

export const getServerSideProps: GetServerSideProps =
  usersApiServer.findUserById;

export default EditUser;

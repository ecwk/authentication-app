import Head from 'next/head';
import NextLink from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage, GetServerSideProps } from 'next';
import { Flex, Heading, Text, Button, Box } from '@chakra-ui/react';
import { Table, Tbody, Tr, Td, TableContainer } from '@chakra-ui/react';

import { ProfileAvatar } from 'src/modules/users/components';
import { usersApiServer } from 'src/modules/users/api';
import { useAuth } from 'src/modules/auth/hooks';
import { User } from 'src/modules/users/types';

type ServerSideProps = {
  user: User | null;
};

type UserProps = ServerSideProps & {};

const User: NextPage<UserProps> = ({ user }) => {
  const { user: sessionUser } = useAuth();
  const router = useRouter();
  const userId = router.query.userid as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <>
      <Flex
        flexDir="column"
        alignItems="center"
        mx={{
          base: 0,
          md: 8
        }}
      >
        <Head>
          <title>{user?.profile?.name || user?.email || 'User Profile'}</title>
          <meta
            name="description"
            content="Page displaying a user's public information"
          />
        </Head>
        <Heading fontWeight="400">Personal Info</Heading>
        <Text mt={2} fontWeight="300">
          Basic info, like your name and photo
        </Text>
        <Box
          mt={8}
          w="100%"
          maxW="850px"
          border={{ base: 'none', md: '1px solid' }}
          borderColor={{ md: 'gray.200' }}
          borderRadius="2xl"
          mb={20}
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
            mx={10}
            my={8}
            gap={10}
          >
            <Box>
              <Heading fontSize="24px" fontWeight="400">
                Profile
              </Heading>
              <Text mt={2} color="#828282">
                Some info may be visible to other people
              </Text>
            </Box>
            <NextLink href={`/users/${userId}/edit`}>
              <Button
                variant="outline"
                colorScheme="gray"
                px={8}
                color="gray"
                fontWeight="400"
                borderRadius="xl"
                isDisabled={sessionUser?.id !== userId}
                onClick={() => {
                  setIsLoading(true);
                }}
                isLoading={isLoading}
              >
                Edit
              </Button>
            </NextLink>
          </Flex>
          <TableContainer borderTop="1px solid #D3D3D3" px={8}>
            <Table variant="simple">
              <Tbody>
                <Tr>
                  <Td width="30%" fontSize="sm" color="gray.400">
                    PHOTO
                  </Td>
                  <Td>
                    <ProfileAvatar user={user} width="72px" height="72px" />
                  </Td>
                </Tr>
                <Tr minHeight="80px" maxHeight="1000px">
                  <Td py={6} fontSize="sm" color="gray.400">
                    NAME
                  </Td>
                  <Td>{user?.profile?.name || '-'}</Td>
                </Tr>
                <Tr>
                  <Td py={6} fontSize="sm" color="gray.400">
                    <Text>BIO</Text>
                  </Td>
                  <Td>{user?.profile?.bio || '-'}</Td>
                </Tr>
                <Tr>
                  <Td py={6} fontSize="sm" color="gray.400">
                    PHONE
                  </Td>
                  <Td>{user?.profile?.phone || '-'}</Td>
                </Tr>
                <Tr>
                  <Td py={6} fontSize="sm" color="gray.400">
                    EMAIL
                  </Td>
                  <Td>{user?.email || '-'}</Td>
                </Tr>
                <Tr>
                  <Td py={6} fontSize="sm" color="gray.400">
                    PASSWORD
                  </Td>
                  <Td>**********</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Flex>
    </>
  );
};

export const getServerSideProps: GetServerSideProps =
  usersApiServer.findUserById;

export default User;

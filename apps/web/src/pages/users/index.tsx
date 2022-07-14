import {
  Box,
  Flex,
  Text,
  Heading,
  Grid,
  GridItem,
  Button
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';

import { usersApiServer } from 'src/modules/users/api';
import { ProfileAvatar } from 'src/modules/users/components';
import { User } from 'src/modules/users/types';

type ServerSideProps = {
  users: User[] | null;
};

type UsersProps = ServerSideProps & {};

const Users: NextPage<UsersProps> = ({ users }) => {
  return (
    <Flex justifyContent="center" mt="30px">
      <Flex
        flexDir="column"
        border={{ base: 'none', md: '1px solid #E0E0E0' }}
        py={8}
        borderRadius="2xl"
        width="100%"
        maxW="850px"
        sx={{
          '&>*': {
            px: 10
          }
        }}
        mb={20}
        mx={{
          base: 0,
          md: 8
        }}
      >
        <Box borderBottom="1px solid #D3D3D3">
          <Heading fontSize="40" fontWeight="400" mb={8}>
            Users
          </Heading>
        </Box>
        {users?.map((user, index) => (
          <Grid
            key={user.id}
            py={5}
            borderBottom={
              index === users.length - 1 ? 'none' : '1px solid #E0E0E0'
            }
            pb={index === users.length - 1 ? 0 : 5}
            templateRows="1fr max-content"
            templateColumns="1fr max-content"
            rowGap={4}
          >
            <GridItem display="flex" alignItems="center" gap={4}>
              <ProfileAvatar user={user} size="lg" />
              <Text fontWeight="bold" fontSize="xl" color="gray.700">
                {user.profile?.name}
              </Text>
            </GridItem>
            <GridItem rowSpan={2} display="flex" alignItems="center">
              <NextLink href={`users/${user.id}`}>
                <Button variant="ghost" color="gray.500" fontWeight="medium">
                  View Profile
                </Button>
              </NextLink>
            </GridItem>
            <GridItem>
              <Text color="gray.600" fontWeight="light" maxW="60ch">
                {user.profile?.bio || `${user.profile?.name} has no bio 😞`}
              </Text>
            </GridItem>
          </Grid>
        ))}
      </Flex>
    </Flex>
  );
};

export const getServerSideProps: GetServerSideProps = usersApiServer.findUsers;
export default Users;

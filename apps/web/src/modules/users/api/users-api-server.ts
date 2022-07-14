import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';

import { server } from '@config/axios';
import { User } from '../types';

const findUserById: GetServerSideProps = async (context) => {
  const token = context.req.cookies.token?.replace(/^"(.*)"$/, '$1');
  let user: User | null;
  if (!token) {
    user = null;
  } else {
    server.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const id = context.query.userid as string;
      user = (await server.get(`/users/${id}`)).data;
    } catch (err) {
      if (!(err instanceof AxiosError)) {
        console.error(err);
      }
      user = null;
    }
  }
  return {
    props: {
      user: user
    }
  };
};

const findUsers: GetServerSideProps = async (context) => {
  const token = context.req.cookies.token?.replace(/^"(.*)"$/, '$1');
  let users: User[] | null = null;
  if (!token) {
    users = null;
  } else {
    server.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      users = (await server.get('/users')).data;
    } catch (err) {
      if (!(err instanceof AxiosError)) {
        console.error(err);
      }
      users = null;
    }
  }
  return {
    props: {
      users: users
    }
  };
};

export const usersApiServer = {
  findUserById,
  findUsers
};

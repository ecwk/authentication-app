import axios, { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';

import { User } from '../types';

const findUserById: GetServerSideProps = async (context) => {
  const token = context.req.cookies.token?.replace(/^"(.*)"$/, '$1');
  let user: User | null;
  if (!token) {
    user = null;
  } else {
    const instance = axios.create();
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const id = context.query.userid as string;
      user = (await instance.get(`/users/${id}`)).data;
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
    const instance = axios.create();
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      users = (await instance.get('/users')).data;
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

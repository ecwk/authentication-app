import jwt, { Jwt } from 'jsonwebtoken';
import axios, { AxiosError } from 'axios';
import { ReactNode, useEffect } from 'react';
import { useState, useContext, createContext } from 'react';

import { usersApiClient } from 'src/modules/users/api';
import { User } from 'src/modules/users/types';
import { client } from '@config/axios';
import { useCookie } from 'src/hooks';

type Token = Jwt & {
  encoded: string;
};

interface AuthContextInterface {
  token: Token | null | undefined;
  userId: string | null | undefined;
  user: User | null | undefined;
  fetchUser: () => Promise<User | undefined>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const useAuthProvider = (): AuthContextInterface => {
  const [encodedToken, setEncodedToken] = useCookie<string | null | undefined>(
    'token',
    undefined
  );
  const [token, setToken] = useState<Token | null | undefined>(undefined);
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [user, setUser] = useState<User | null | undefined>(undefined);

  // Parse encode jwt
  useEffect(() => {
    if (encodedToken) {
      const decodedToken = jwt.decode(encodedToken, { complete: true });
      if (decodedToken) {
        setToken({
          encoded: encodedToken,
          ...decodedToken
        });
      }
    } else {
      setToken(null);
    }
  }, [encodedToken]);

  // Set userId from token
  useEffect(() => {
    if (token || token === null) {
      setUserId(token?.payload.sub || null);
    }
  }, [token]);

  // Set axios auth from token
  useEffect(() => {
    if (token) {
      client.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token.encoded}`;
    } else {
      client.defaults.headers.common['Authorization'] = '';
    }
  }, [token]);

  // Set user from userId
  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      if (userId) {
        const user = await usersApiClient.findUserById(userId);
        setUser(user);
        return user;
      } else if (userId === null) {
        setUser(null);
      }
    } catch (err) {
      // Delete the cookie if invalid
      if (err instanceof AxiosError) {
        const status = err.response?.status;
        if (status === 401) {
          setEncodedToken(null);
        }
      }
      throw err;
    }
  };

  async function login(email: string, password: string): Promise<User> {
    const { token, user } = (
      await client.post<{
        token: { encoded: string; expiresIn: number };
        user: User;
      }>('/login', {
        email,
        password
      })
    ).data;
    setEncodedToken(token.encoded, {
      expires: new Date(token.expiresIn)
    });
    return user;
  }

  async function logout() {
    setToken(null);
    setUserId(null);
    setEncodedToken(null);
    setUser(null);
  }

  return { token, userId, user, fetchUser, login, logout };
};

export const AuthContext = createContext<AuthContextInterface>(
  {} as AuthContextInterface
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

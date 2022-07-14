import axios from 'axios';

import { configuration } from '@config/configuration';
import { sleep } from '@utils/sleep';

// Used in browser
export const client = axios.create({
  baseURL: `${configuration.apiUrl}/api`
});

// Used in Next server (SSR)
export const server = axios.create({
  baseURL: `${configuration.apiUrl}/api`
});

// Mock delays for development
client.interceptors.response.use(async (response) => {
  if (configuration.NODE_ENV === 'development') {
    await sleep(configuration.delay);
  }
  return response;
});

server.interceptors.response.use(async (response) => {
  if (configuration.NODE_ENV === 'development') {
    await sleep(configuration.delay);
  }
  return response;
});

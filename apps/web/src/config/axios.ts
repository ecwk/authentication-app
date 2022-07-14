import axios from 'axios';

import { configuration } from './configuration';

const { apiUrl } = configuration;

export const configureAxios = () => {
  axios.defaults.baseURL = `${apiUrl}/api`;
};

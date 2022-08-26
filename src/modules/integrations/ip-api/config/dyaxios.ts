import axios from 'axios';
import { configurations } from '../../../../infrastructure/configurations/index';

export default axios.create({
  baseURL: `${configurations.implementations.ip_api.link}`,
  headers: {
    Accept: 'application/json',
    'Accept-Language': 'it-it',
    'Content-type': 'application/json',
  },
});

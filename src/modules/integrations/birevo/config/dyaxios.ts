import axios from 'axios';
import { configurations } from '../../../../infrastructure/configurations/index';

export default axios.create({
  baseURL: `${configurations.implementations.ivemo.link}`,
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': 'it-it',
    Authorization: `Basic ${configurations.implementations.ivemo.token}`,
  },
});

import axios from 'axios';
import { configurations } from '../../../../infrastructure/configurations/index';

export default axios.create({
  baseURL: `${configurations.implementations.ipapi.link}`,
  headers: {
    Accept: 'application/json',
    'Accept-Language': 'it-it',
    'Content-type': 'application/json',
    // Authorization: `Basic `,
  },
});

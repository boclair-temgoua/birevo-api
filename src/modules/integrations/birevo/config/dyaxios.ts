import axios from 'axios';
import { configurations } from '../../../../infrastructure/configurations/index';

export default axios.create({
  baseURL: `${configurations.implementations.birevo.link}/re`,
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': 'it-it',
    Authorization: `Basic ${configurations.implementations.birevo.token}`,
  },
});

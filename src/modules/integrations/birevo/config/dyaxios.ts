import axios from 'axios';
import { configurations } from '../../../../infrastructure/configurations/index';

export default axios.create({
  baseURL: `${configurations.implementations.birevo.link}/re`,
  headers: {
    Accept: 'application/json',
    'Accept-Language': 'it-it',
    'Content-type': 'application/json',
    Authorization: `Basic ${configurations.implementations.birevo.token}`,
  },
});

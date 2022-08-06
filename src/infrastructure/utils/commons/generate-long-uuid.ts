import { generateUUID } from './generate-uuid';
import {
  NumberGenerator,
  NumberHashGenerator,
  aleaRNGFactory,
  murmurhash2_x86_32,
  murmurhash3_x86_32,
  murmurhash3_x64_128,
} from 'number-generator';

export const generateLongUUID = (length: number) => {
  let result = '';
  const generator = murmurhash3_x64_128(`${generateUUID}`);
  const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789${generator}`;
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

import { generateUUID } from './generate-uuid';
import murmurhash2_x86_32 from 'number-generator/lib/murmurhash2_x86_32';

export const generateNumber = (length: number) => {
  let result = '';
  const characters = `0123456789${murmurhash2_x86_32(generateUUID())}`;
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

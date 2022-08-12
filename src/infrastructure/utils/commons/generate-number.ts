import { generateUUID } from './generate-uuid';
import { murmurhash2_x86_32 } from 'number-generator';

export const generateNumber = (length: number) => {
  let result = '';

  const generator = murmurhash2_x86_32(`${generateUUID}`);
  const characters = `0123456789${generator}`;
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

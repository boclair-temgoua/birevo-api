import { generateUUID } from './generate-uuid';
import { murmurhash3_x64_128 } from 'number-generator';

export const generateCouponCode = (length: number) => {
  let result = '';
  const generator = murmurhash3_x64_128(`${generateUUID}`);
  const characters =
    `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789${generator}`.toUpperCase();
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

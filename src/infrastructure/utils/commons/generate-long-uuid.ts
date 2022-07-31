import { generateUUID } from './generate-uuid';
import murmurhash3_x64_128 from 'number-generator/lib/murmurhash3_x64_128';

export const generateLongUUID = (length: number) => {
    let result = '';
    const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789${murmurhash3_x64_128(
        generateUUID(),
    )}`;
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

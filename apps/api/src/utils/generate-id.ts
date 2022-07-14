import * as nanoid from 'nanoid';

const { customAlphabet } = nanoid;

export const generateId = () => {
  return customAlphabet(
    'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    10
  )();
};

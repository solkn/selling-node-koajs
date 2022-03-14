import { Keys } from '../constants/keys';
import * as Boom from 'boom';

export const unauthorizedWithKey = (message: string, key: Keys): Boom<any> => {
  const err = Boom.unauthorized(message);
  // @ts-ignore
  (err.data as string) = key;
  return err;
};

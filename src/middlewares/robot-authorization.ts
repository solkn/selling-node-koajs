import { Context } from 'koa';
import { INext } from '../interfaces/next';
import { unauthorizedWithKey } from '../utils/boom-util';
import { Keys } from '../constants/keys';
import * as config from 'config';

export const authorizeRobot = async (ctx: Context, next: INext) => {
  const authorization = ctx.headers.authorization;
  const robotAuthorization = config.get<string>('robotAuthorization');
  if (!authorization) {
    throw unauthorizedWithKey('Authorization is required', Keys.UNAUTHORIZED_ROBOT);
  }
  if (authorization !== robotAuthorization) {
    throw unauthorizedWithKey('Invalid Authorization', Keys.UNAUTHORIZED_ROBOT);
  }
  await next();
};

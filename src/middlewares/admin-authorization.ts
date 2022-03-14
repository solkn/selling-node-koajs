import { Context } from 'koa';
import { INext } from '../interfaces/next';
import * as config from 'config';
import { IAdminConfig } from '../interfaces/admin-config';
import { unauthorizedWithKey } from '../utils/boom-util';
import { Keys } from '../constants/keys';

export const adminAuthorization = () => async (ctx: Context, next: INext) => {
  const adminConfig = config.get<IAdminConfig>('admin');
  const authorization = ctx.headers.adminauthorization;
  if (!authorization) {
    throw unauthorizedWithKey('Admin Authorization is required', Keys.UNAUTHORIZED_ADMIN);
  }

  if (authorization !== adminConfig.token) {
    throw unauthorizedWithKey('Admin Authorization is invalid', Keys.UNAUTHORIZED_ADMIN);
  }

  await next();
};

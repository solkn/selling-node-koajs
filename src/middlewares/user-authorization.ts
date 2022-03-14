import { Context } from 'koa';
import { INext } from '../interfaces/next';
import * as UsersService from '../services/users';
import { decodeAuthorizationToken } from '../services/users';
import { IUserModel } from '../models/interfaces/user-model';
import { unauthorizedWithKey } from '../utils/boom-util';
import { Keys } from '../constants/keys';
import { SubscriptionType } from '../constants/subscription-type';
import * as Boom from 'boom';

export const authorizeUser = (config?: {
  isTradeSubscriptionRequired?: boolean,
  isOptional?: boolean,
}) => {

  return async (ctx: Context, next: INext) => {
     const authorization = ctx.headers.authorization;
    ctx.state.session = await getUserFromAuthTokenOrThrowException(String(authorization), config || {});
    await next();
  };
};

const getUserFromAuthTokenOrThrowException =
  async (authorization: string, config: {
    isTradeSubscriptionRequired?: boolean,
    isOptional?: boolean,
  }): Promise<IUserModel | undefined | null | never> => {

    if (!authorization) {
      if (config.isOptional) {
        return null;
      } else {
        throw unauthorizedWithKey('Authorization is required', Keys.UNAUTHORIZED_MAIN);
      }
    }
    const decodedToken = decodeAuthorizationToken(authorization);
    if (!decodedToken) {
      throw unauthorizedWithKey('Invalid authorization', Keys.UNAUTHORIZED_MAIN);
    }
    const user = await UsersService.getUserByIToken(decodedToken);
    if (!user) {
      throw unauthorizedWithKey('Invalid authorization', Keys.UNAUTHORIZED_MAIN);
    }

    if (config.isTradeSubscriptionRequired
      && (user.subscriptionType === SubscriptionType.LEVELS_SIGNALS
        //|| user.subscriptionExpireOn.getTime() < Date.now()
        )) {
      throw Boom.paymentRequired('You need Premium subscription to place order');
    }
    return user;
  };

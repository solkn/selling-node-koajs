import { Context } from 'koa';
import { INext } from '../interfaces/next';
import { unauthorizedWithKey } from '../utils/boom-util';
import { Keys } from '../constants/keys';

export const aliceAuthorization = () => async (ctx: Context, next: INext) => {
  const session = ctx.state.session;
  if (!session.aliceUsername || !session.alicePassword || !session.aliceAnswer) {
    throw unauthorizedWithKey('Alice is not logged int', Keys.UNAUTHORIZED_ALICE);
  }

  await next();
};

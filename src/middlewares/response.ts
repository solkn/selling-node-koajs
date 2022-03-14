import { Context } from 'koa';
import { Response } from '../interfaces/response';
import * as Boom from 'boom';
import { Keys } from '../constants/keys';

export const responseMiddleware = async (ctx: Context, next: () => void) => {
  if (ctx.state.data === undefined) {
    throw Boom.notFound('Api Not Found');
  }
  const body: Response = {
    metaData: {
      status: ctx.status,
      message: ctx.state.message || 'success',
      key: Keys.NONE,
      totalCount: ctx.state.totalCount,
    }
  };
  if (ctx.state.data !== null) {
    body.data = ctx.state.data;
  }
 // ctx.body = body;
  //ctx.status = ctx.body.metaData.status;
  ctx.status = Number(body.metaData.status);
  await next();
};

import { Context } from 'koa';
import { INext } from '../interfaces/next';
import { validate } from '../utils/joi-util';
import * as Joi from 'joi';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../constants/common-constants';

export const offsetLimitMiddleware = async (ctx: Context, next: INext) => {
  const query = {
    offset: ctx.request.query.offset,
    limit: ctx.request.query.limit,
  };
  const value = validate(query, {
    offset: Joi.number().min(DEFAULT_OFFSET).default(DEFAULT_OFFSET),
    limit: Joi.number().max(DEFAULT_LIMIT).default(DEFAULT_LIMIT),
  });

  ctx.state.limit = value.limit;
  ctx.state.offset = value.offset;
  await next();
};

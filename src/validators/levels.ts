import { Context } from 'koa';
import { INext } from '../interfaces/next';
import { validate } from '../utils/joi-util';
import * as Joi from 'joi';
import * as SymbolAliasesServices from '../services/symbol-aliases';
import { Platform } from '../constants/platform';
import * as Boom from 'boom';

export const createLevel = async (ctx: Context, next: INext) => {
  const body = validate(ctx.request.body, {
    signalId: Joi.number().positive().integer().required(),
    symbolAlias: Joi.string().max(50).required(),
    digit: Joi.number().integer().required(),
    buyPrice: Joi.number().required(),
    buyTarget1: Joi.number().required(),
    buyTarget2: Joi.number().required(),
    buyTarget3: Joi.number().required(),
    sellPrice: Joi.number().required(),
    sellTarget1: Joi.number().required(),
    sellTarget2: Joi.number().required(),
    sellTarget3: Joi.number().required(),
    stopLoss: Joi.number().required(),
  });

  const symbolAlias = await SymbolAliasesServices.getSymbolAliasByNameAndExchange({
    alias: body.symbolAlias,
    platform: Platform.KITE,
  });
  if (!symbolAlias) {
    throw Boom.notFound('symbolAlias not found');
  }
  ctx.state.body = {
    ...body,
    symbolName: symbolAlias.name,
    exchange: symbolAlias.exchange,
  };
  await next();
};

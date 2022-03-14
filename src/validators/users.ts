import { Context } from 'koa';
import { INext } from '../interfaces/next';
import { validate } from '../utils/joi-util';
import * as Joi from 'joi';
import * as SymbolAliasesService from '../services/symbol-aliases';
import * as Boom from 'boom';
import { SubscriptionType } from '../constants/subscription-type';

export const selectUserSymbols = async (ctx: Context, next: INext) => {
  const body = validate(ctx.request.body, {
    symbolAliasIds: Joi.array().items(Joi.number()).unique().required(),
  });

  const symbolAliases = await SymbolAliasesService.getSymbolAliasesByIds(body.symbolAliasIds);

  if (body.symbolAliasIds.length !== symbolAliases.length) {
    throw Boom.notFound('Few symbolAliasIds not found');
  }
  ctx.state.body = body;
  await next();
};

export const getAliceUsers = async (ctx: Context, next: INext) => {
  ctx.state.query = validate(ctx.request.query, {
    aliceBranchCode: Joi.string().max(100),
    // subscriptionType: Joi.string().only(
    //   SubscriptionType.TRIAL,
    //   SubscriptionType.LEVELS_SIGNALS,
    //   SubscriptionType.LEVELS_SIGNALS_TRADE),
    subscriptionType:Joi.object().keys({
      trial:Joi.string().validate(SubscriptionType.TRIAL),
      levelsSignals:Joi.string().validate(SubscriptionType.LEVELS_SIGNALS),
      levelsSignalsTrade:Joi.string().validate(SubscriptionType.LEVELS_SIGNALS_TRADE)
    }),
    startDate: Joi.date(),
    endDate: Joi.date()
  }, true);
  await next();
};

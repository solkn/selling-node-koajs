import { Context } from 'koa';
import { INext } from '../interfaces/next';
import { validate } from '../utils/joi-util';
import * as Joi from 'joi';
import { Exchange } from '../constants/exchange';
import { OrderType } from '../constants/order-type';
import { BracketType } from '../constants/bracket-type';
import * as Boom from 'boom';
import * as SymbolAliasesServices from '../services/symbol-aliases';
import { Platform } from '../constants/platform';
import { MONTHS } from '../constants/common-constants';
import * as LevelsService from '../services/levels';

export const placeBracketOrder = async (ctx: Context, next: INext) => {
  const body = validate(ctx.request.body, {
    levelId: Joi.number().required(),
    exchange: Joi.string().only(),//Exchange.MCX, Exchange.NSE, Exchange.NFO).insensitive().uppercase().required(),
    symbolName: Joi.string().required(),
    orderType: Joi.string().only(),//OrderType.BUY, OrderType.SELL).insensitive().lowercase().required(),
    quantity: Joi.number().integer().required(),
    price: Joi.number().precision(1).required(),
    stopLoss: Joi.number().precision(1).required(),
    target: Joi.number().precision(1).required(),
    bracketType: Joi.string().only(),//BracketType.LIMIT, BracketType.STOP_LOSS).required(),
    triggerPrice: Joi.number().precision(1),
    month: Joi.string().only(),//MONTHS).insensitive().lowercase(),
  });

  if (body.bracketType === BracketType.STOP_LOSS && isNaN(body.triggerPrice)) {
    throw Boom.badRequest('triggerPrice is required when bracketType is SL');
  }
  if (body.bracketType === BracketType.LIMIT) {
    body.triggerPrice = null;
  }
  if (body.exchange !== Exchange.NSE && !body.month) {
    throw Boom.badRequest('month is required');
  }
  if (body.exchange === Exchange.NSE) {
    body.month = null;
  }
  const level = await LevelsService.getLevelById(body.levelId);
  if (!level) {
    throw Boom.notFound('Level not found');
  }

  const aliceSymbolAlias = await SymbolAliasesServices.getSymbolAliasByNameAndExchange({
    name: body.exchange === Exchange.NSE ?
      body.symbolName :
      `${body.symbolName} ${body.month.toUpperCase()} FUT`,
    exchange: body.exchange,
    platform: Platform.ALICE,
  });
  if (!aliceSymbolAlias) {
    throw Boom.notFound('Instrument token not found');
  }
  ctx.state.symbolAlias = aliceSymbolAlias;
  ctx.state.body = body;
  await next();
};

export const placeCoverOrder = async (ctx: Context, next: INext) => {
  const body = validate(ctx.request.body, {
    levelId: Joi.number().required(),
    exchange: Joi.string().only(),//Exchange.MCX, Exchange.NSE, Exchange.NFO).insensitive().uppercase().required(),
    symbolName: Joi.string().required(),
    orderType: Joi.string().only(),//OrderType.BUY, OrderType.SELL).insensitive().lowercase().required(),
    quantity: Joi.number().integer().required(),
    price: Joi.number().precision(1).required(),
    stopLoss: Joi.number().precision(1).required(),
    month: Joi.string().only(),//MONTHS).insensitive().lowercase(),
  });

  if (body.exchange !== Exchange.NSE && !body.month) {
    throw Boom.badRequest('month is required');
  }
  if (body.exchange === Exchange.NSE) {
    body.month = null;
  }

  const level = await LevelsService.getLevelById(body.levelId);
  if (!level) {
    throw Boom.notFound('Level not found');
  }

  const aliceSymbolAlias = await SymbolAliasesServices.getSymbolAliasByNameAndExchange({
    name: body.exchange === Exchange.NSE ?
      body.symbolName :
      `${body.symbolName} ${body.month.toUpperCase()} FUT`,
    exchange: body.exchange,
    platform: Platform.ALICE,
  });
  if (!aliceSymbolAlias) {
    throw Boom.notFound('Instrument token not found');
  }
  ctx.state.symbolAlias = aliceSymbolAlias;
  ctx.state.body = body;
  await next();
};

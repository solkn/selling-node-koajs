import { Context } from 'koa';
import { INext } from '../interfaces/next';
import { validate } from '../utils/joi-util';
import * as Joi from 'joi';
import * as SymbolAliasesServices from '../services/symbol-aliases';
import { Platform } from '../constants/platform';
import * as Boom from 'boom';
import { SignalType } from '../constants/signal-type';
import * as SignalsService from '../services/signals';
import { OrderType } from '../constants/order-type';
import { join } from 'path/posix';

export const createOrUpdateSignal = async (ctx: Context, next: INext) => {
  const params: { signalType: SignalType } = validate(ctx.params, {
    //signalType: Joi.string().only(
      // SignalType.BUY,
      // SignalType.SELL,
      // SignalType.STOP_LOSS,
      // SignalType.TARGET_1,
      // SignalType.TARGET_2,
      // SignalType.TARGET_3,
     //).required(),
    
    //  SignalType:Joi.object().keys({
    //   stop_loss:Joi.string().validate(SignalType.STOP_LOSS),
    //   targer_1:Joi.string().validate(SignalType.TARGET_1),
    //   target_2:Joi.string().validate(SignalType.TARGET_2),
    //   target_3:Joi.string().validate(SignalType.TARGET_3),
         
    // }).required(),
    
  });
  ctx.state.signalType = params.signalType;
  const symbolAliasBody = validate(ctx.request.body, {
    symbolAlias: Joi.string().max(50).required(),
  }, true);
  const symbolAlias = await SymbolAliasesServices.getSymbolAliasByNameAndExchange({
    alias: symbolAliasBody.symbolAlias,
    platform: Platform.KITE,
  });
  if (!symbolAlias) {
    throw Boom.notFound('symbolAlias not found');
  }
  ctx.state.symbolAlias = symbolAlias;

  if (params.signalType === SignalType.BUY || params.signalType === SignalType.SELL) {
    const body = validate(ctx.request.body, {
      signalId: Joi.number().positive().integer().required(),
      price: Joi.number().required(),
      stopLoss: Joi.number().required(),
      target1: Joi.number().required(),
      target2: Joi.number().required(),
      target3: Joi.number().required(),
    }, true);
    const oldSignal = await SignalsService.getTodaySignalBy({
      symbolName: symbolAlias.name,
      exchange: symbolAlias.exchange,
      orderType: params.signalType === SignalType.SELL ? OrderType.SELL : OrderType.BUY,
    });
    if (oldSignal) {
      throw Boom.conflict('Signal already exists');
    }
    ctx.state.body = {
      ...body,
      orderType: params.signalType,
      symbolName: symbolAlias.name,
      symbolAlias: symbolAlias.alias,
      exchange: symbolAlias.exchange,
    };
  } else {
    const lotSize: number = JSON.parse(symbolAlias.otherData).lotSize || 1;
    if (params.signalType === SignalType.STOP_LOSS) {

      const body = validate(ctx.request.body, {
        stopLoss: Joi.number().required(),
        profit: Joi.number().max(0).required(),
      }, true);
      const signal = await SignalsService.getUpdateAbleSignalForStopLoss({
        symbolName: symbolAlias.name,
        exchange: symbolAlias.exchange,
        stopLoss: body.stopLoss,
      });
      if (!signal) {
        throw Boom.notFound('Signal not found to update');
      }

      ctx.state.signal = signal;

      ctx.state.body = {
        profit1: body.profit * lotSize,
        totalProfit: body.profit * lotSize,
      };
    } else {
      const body = validate(ctx.request.body, {
        target: Joi.number().required(),
        profit: Joi.number().min(0).required(),
      }, true);
      const signal = await SignalsService.getUpdateAbleSignalForTarget({
        symbolName: symbolAlias.name,
        exchange: symbolAlias.exchange,
        target1: params.signalType === SignalType.TARGET_1 ? body.target : undefined,
        target2: params.signalType === SignalType.TARGET_2 ? body.target : undefined,
        target3: params.signalType === SignalType.TARGET_3 ? body.target : undefined,
      });
      if (!signal) {
        throw Boom.notFound('Signal not found to update');
      }

      ctx.state.signal = signal;

      switch (params.signalType) {
        case  SignalType.TARGET_1: {
          ctx.state.body = {
            profit1: (body.profit * lotSize),
            totalProfit: (body.profit * lotSize),
          };
          break;
        }
        case  SignalType.TARGET_2: {
          ctx.state.body = {
            profit2: (body.profit * lotSize),
            totalProfit: signal.profit1 + (body.profit * lotSize),
          };
          break;
        }
        case  SignalType.TARGET_3: {
          ctx.state.body = {
            profit3: (body.profit * lotSize),
            totalProfit: signal.profit1 + signal.profit2 + (body.profit * lotSize),
          };
          break;
        }
      }
    }
  }

  await next();
};

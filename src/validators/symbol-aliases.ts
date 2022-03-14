import { Context } from 'koa';
import { INext } from '../interfaces/next';
import { validate } from '../utils/joi-util';
import * as Joi from 'joi';
import { Platform } from '../constants/platform';
import { Exchange } from '../constants/exchange';

export const searchSymbolAliasesByPlatform = async (ctx: Context, next: INext) => {
  const path = validate(ctx.params, {
    platform: Joi.object().keys({
      kite:Joi.string().validate(Platform.KITE),
      alice:Joi.string().validate(Platform.ALICE),
      upstox:Joi.string().validate(Platform.UPSTOX)
    }).required(),
  });
  const queryParams = validate(ctx.request.query, {
    nameSearch: Joi.string().required(),
    //exchange: Joi.string().only()//Exchange.MCX, Exchange.NFO, Exchange.NSE),
    exchange: Joi.object().keys({
      mcx:Joi.string().validate(Exchange.MCX),
      nfo:Joi.string().validate(Exchange.NFO),
      nse:Joi.string().validate(Exchange.NSE)

    }).required(),
  });
  ctx.state.body = {
    ...path,
    ...queryParams,
  };
  await next();
};

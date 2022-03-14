import { Context } from 'koa';
import { INext } from '../interfaces/next';
import * as AliceService from '../services/alice';
import { ISymbolAliasModel } from '../models/interfaces/symbol-alias-model';
import * as OrderHistoriesService from '../services/order-histories';
import { TradeType } from '../constants/trade-type';
import { OrderHistoryModel } from '../models/classes/model';
import { IOrderHistoryModel } from '../models/interfaces/order-history-model';
import { BracketType } from '../constants/bracket-type';

export const placeBracketOrder = async (ctx: Context, next: INext) => {
  const symbolAlias: ISymbolAliasModel = ctx.state.symbolAlias;
  const response = await AliceService.placeBracketOrder(
    ctx.state.session.aliceUsername, {
      ...ctx.state.body,
      instrumentToken: symbolAlias.alias,
    });
  await OrderHistoriesService.createOrderHistory({
    ...OrderHistoryModel.map(ctx.state.body),
    userId: ctx.state.session.id,
    levelId: ctx.state.body.levelId,
    orderId: response.orderId,
    tradeType: TradeType.BRACKET_ORDER,
  } as IOrderHistoryModel);
  ctx.state.data = response;
  await next();
};

export const placeCoverOrder = async (ctx: Context, next: INext) => {
  const symbolAlias: ISymbolAliasModel = ctx.state.symbolAlias;
  const response = await AliceService.placeCoverOrder(
    ctx.state.session.aliceUsername, {
      ...ctx.state.body,
      instrumentToken: symbolAlias.alias,
    });
  await OrderHistoriesService.createOrderHistory({
    ...OrderHistoryModel.map(ctx.state.body),
    userId: ctx.state.session.id,
    levelId: ctx.state.body.levelId,
    orderId: response.orderId,
    bracketType: BracketType.LIMIT,
    tradeType: TradeType.COVER_ORDER,
  } as IOrderHistoryModel);
  ctx.state.data = response;
  await next();
};

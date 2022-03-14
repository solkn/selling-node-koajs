import { Context } from 'koa';
import { INext } from '../interfaces/next';
import * as SymbolAliasesService from '../services/symbol-aliases';

export const getSymbolAliases = async (ctx: Context, next: INext) => {
  ctx.state.data = await SymbolAliasesService.getAllSymbolAliases();
  await next();
};

export const searchSymbolAliasesByPlatform = async (ctx: Context, next: INext) => {
  ctx.state.data = await SymbolAliasesService.searchSymbolAliasesByName(ctx.state.body);
  await next();
};

export const updateAliceInstruments = async (ctx: Context, next: INext) => {
  await SymbolAliasesService.updateAliceInstruments();
  ctx.state.data = null;
  await next();
};

import { UserSymbolModel } from '../models/classes/model';
import { IUserSymbolModel } from '../models/interfaces/user-symbol-model';
import * as SymbolAliasesService from './symbol-aliases';

const userSymbolModel = new UserSymbolModel();

export const getUserSymbolsByUserId =
  async (userId: number, offset: number, limit: number): Promise<IUserSymbolModel[]> => {
    return userSymbolModel.getByUserId(userId, offset, limit);
  };

export const selectUserSymbols = async (userId: number, symbolAliasIds: number[]) => {
  await userSymbolModel.deleteByUserId(userId);
  await userSymbolModel.bulkInsert(symbolAliasIds.map((symbolAliasId) => {
    return {
      userId,
      symbolAliasId,
    } as IUserSymbolModel;
  }));
};

export const selectUserSymbolsBySymbolNames = async (userId: number, symbolNames: string[]) => {
  const symbolAliases = await SymbolAliasesService.getSymbolAliasesBySymbolNames(symbolNames);
  return selectUserSymbols(userId, symbolAliases.map((sa) => sa.id));
};

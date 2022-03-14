import { IModel } from './model';

export interface IUserSymbolModel extends IModel {
  userId: number;
  symbolAliasId: number;

  // join to symbolAliases

  symbolName: string;
  symbolAlias: string;
  symbolExchange: string;
}

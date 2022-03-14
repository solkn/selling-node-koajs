import { IModel } from './model';
import { Exchange } from '../../constants/exchange';
import { Platform } from '../../constants/platform';

export interface ISymbolAliasModel extends IModel {
  name: string;
  alias: string;
  company: string;
  exchange: Exchange;
  otherData: string;
  platform: Platform;
}

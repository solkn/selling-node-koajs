import { IModel } from './model';
import { Exchange } from '../../constants/exchange';

export interface ILevelModel extends IModel {
  signalId: number;
  symbolName: string;
  symbolAlias: string;
  exchange: Exchange;
  digit: number;
  buyPrice: number;
  buyTarget1: number;
  buyTarget2: number;
  buyTarget3: number;
  sellPrice: number;
  sellTarget1: number;
  sellTarget2: number;
  sellTarget3: number;
  stopLoss: number;
}

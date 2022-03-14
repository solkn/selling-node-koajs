import { IModel } from './model';
import { Exchange } from '../../constants/exchange';
import { OrderType } from '../../constants/order-type';

export interface ISignalModel extends IModel {
  signalId: number;
  symbolName: string;
  symbolAlias: string;
  exchange: Exchange;
  orderType: OrderType;
  price: number;
  target1: number;
  target2: number;
  target3: number;
  stopLoss: number;
  profit1: number;
  profit2: number;
  profit3: number;
  totalProfit: number;
}

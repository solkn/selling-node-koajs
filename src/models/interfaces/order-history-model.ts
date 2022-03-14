import { IModel } from './model';
import { OrderType } from '../../constants/order-type';
import { BracketType } from '../../constants/bracket-type';
import { TradeType } from '../../constants/trade-type';

export interface IOrderHistoryModel extends IModel {
  userId: number;
  levelId: number;
  orderId: string;
  orderType: OrderType;
  quantity: number;
  price: number;
  triggerPrice: number | null;
  stopLoss: number;
  target: number | null;
  bracketType: BracketType;
  month: string | null;
  tradeType: TradeType;
}

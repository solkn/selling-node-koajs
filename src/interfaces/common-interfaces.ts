import { Exchange } from '../constants/exchange';
import { OrderType } from '../constants/order-type';
import { BracketType } from '../constants/bracket-type';

export interface IToken {
  id: number;
  email: string;
  token: string;
}

export interface IAliceFields {
  aliceUsername: string | null;
  alicePassword: string | null;
  aliceAnswer: string | null;
  aliceToken: string | null;
  aliceBranchCode: string | null;
}

export interface IAliceProfile {
  panNumber: string;
  name: string;
  username: string;
  exchanges: string[];
  email: string;
  brokerName: string;
  token: string;
}

export interface IBracketOrderAxiosBody {
  publicToken: string;
  exchange: Exchange;
  instrumentToken: string;
  orderType: OrderType;
  quantity: number;
  price: number;
  triggerPrice?: number;
  stopLoss: number;
  target: number;
  bracketType: BracketType;
}

export interface ICoverOrderAxiosBody {
  publicToken: string;
  exchange: string;
  instrumentToken: string;
  orderType: OrderType;
  quantity: number;
  price: number;
  stopLoss: number;
}

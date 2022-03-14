import { SignalModel } from '../models/classes/model';
import { ISignalModel } from '../models/interfaces/signal-model';
import { Exchange } from '../constants/exchange';
import * as _ from 'lodash';
import * as UserSymbolsService from './user-symbols';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../constants/common-constants';
import { OrderType } from '../constants/order-type';
import { Context } from 'koa';

const signalModel = new SignalModel();

export const getSignals = async() =>{

  const signals = await signalModel.getSignal();

  return signals;
}

export const getSignalById = async (signalId: number): Promise<ISignalModel | undefined> => {
  const signals: ISignalModel[] = await signalModel.getSignal({id: signalId});
  return _.head(signals);
};

export const createSignal = (body: ISignalModel) => {
  return signalModel.storeSignal(body);
};

export const updateSignal = (body: ISignalModel) => {
  return signalModel.updateSignal(body);
};

export const updateSignalBySymbolNameAndExchange = (body: ISignalModel, where: {
  symbolName: string,
  exchange: Exchange,
}) => {
  return signalModel.updateSignal(body, where);
};

export const getAllRecentUserSignals =
  async (userId: number, offset: number, limit: number): Promise<ISignalModel[]> => {
    const userSymbols = await UserSymbolsService
      .getUserSymbolsByUserId(userId, DEFAULT_OFFSET, DEFAULT_LIMIT);
    return signalModel.getRecentSignals({
      symbolAliases: userSymbols.map((obj) => obj.symbolAlias)
    }, offset, limit);
  };

export const getUpdateAbleSignalForStopLoss = async (where: {
  symbolName: string,
  exchange: Exchange,
  stopLoss: number,
}) => {
  const signals: ISignalModel[] = await signalModel.getUpdateAbleForStopLoss(where);
  return _.head(signals);
};

export const getUpdateAbleSignalForTarget = async (where: {
  symbolName: string,
  exchange: Exchange,
  target1?: number,
  target2?: number,
  target3?: number,
}) => {
  const signals: ISignalModel[] = await signalModel.getUpdateAbleForTarget(where);
  return _.head(signals);
};

export const getTodaySignalBy = async (where: {
  symbolName: string,
  exchange: Exchange,
  orderType: OrderType,
}) => {
  const signals: ISignalModel[] = await signalModel.getTodayBy(where);
  return _.head(signals);
};


// export const deleteSignal = async(id:number) =>{

//   const deletedSignal = await signalModel.deleteSignal(id);

//   return;
// }


export const deleteSignal = async (signalId: number): Promise<ISignalModel | undefined> => {
  const signal = await signalModel.deleteSignal({id: signalId});
  return;
};
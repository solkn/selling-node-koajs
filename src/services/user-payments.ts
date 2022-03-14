import { IUserPaymentModel } from '../models/interfaces/user-payment-model';
import { UserPaymentModel } from '../models/classes/model';
import * as _ from 'lodash';

const userPaymentModel = new UserPaymentModel();

export const createUserPayment = (body: IUserPaymentModel) => {
  return userPaymentModel.insert(body);
};

export const getUserPaymentByPaymentId = async (paymentId: string): Promise<IUserPaymentModel | undefined> => {
  const userPayments: IUserPaymentModel[] = await userPaymentModel.get({paymentId});
  return _.head(userPayments);
};
export const getAliceUserPaymentsTotalAmountOfAlice = async (query: any) => {
  return userPaymentModel.getTotalAmountOfAlice(query);
};

export const getAliceUserPayments = async (query: any, offset: number, limit: number) => {
  return userPaymentModel.getOfAlice(query, offset, limit);
};

export const getCountOfAliceUserPayments = async (query: any) => {
  return userPaymentModel.getCountOfAlice(query);
};

import { IOrderHistoryModel } from '../models/interfaces/order-history-model';
import { OrderHistoryModel } from '../models/classes/model';

const orderHistoryModel = new OrderHistoryModel();
export const createOrderHistory = (body: IOrderHistoryModel) => {
  return orderHistoryModel.insert(body);
};

export const getLatestOrderHistoriesByUserId = (userId: number): Promise<IOrderHistoryModel> => {
  return orderHistoryModel.getLatestByUserId(userId);
};

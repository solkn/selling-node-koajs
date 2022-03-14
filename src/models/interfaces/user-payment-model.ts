import { IModel } from './model';
import { SubscriptionType } from '../../constants/subscription-type';

export interface IUserPaymentModel extends IModel {
  userId: number;
  subscriptionType: SubscriptionType;
  accountId: string;
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  method: string;
  bank: string;
  email: string;
  phoneNumber: string;
  paidOn: Date;
}

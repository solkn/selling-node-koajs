import { IModel } from './model';
import { UserType } from '../../constants/user-type';
import { SubscriptionType } from '../../constants/subscription-type';

export interface IUserModel extends IModel {
  name: string;
  email: string;
  phoneNumber: string;
  isByTemporaryPassword: boolean;
  authorization?: string;
  token?: string;
  password?: string | null;
  temporaryPassword?: string | null;
  aliceUsername: string | null;
  alicePassword: string | null;
  aliceAnswer: string | null;
  aliceToken: string | null;
  aliceBranchCode: string | null;
  userType: UserType;
  subscriptionType: SubscriptionType;
  subscriptionExpireOn: Date;
}

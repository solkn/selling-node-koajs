import { IModel } from './model';

export interface IUserFcmTokenModel extends IModel {
  userId: number;
  fcmToken: string;
}

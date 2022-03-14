import { IUserModel } from '../models/interfaces/user-model';

export interface IState {
  message: string;
  status: number;
  data: any;
  session: IUserModel;
  body?: any;
  totalCount?: number;
  offset: number;
  limit: number;

  [key: string]: any;
}

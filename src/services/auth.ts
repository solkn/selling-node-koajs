import { UserModel } from '../models/classes/model';
import { IUserModel } from '../models/interfaces/user-model';

const userModel = new UserModel();

export const saveUser = async (): Promise<IUserModel[]> => {
  await userModel.storeUser({
    name: 'Solomon Kindie'
  } as IUserModel);
  return userModel.get({});
};

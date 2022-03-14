import { UserModel } from '../models/classes/model';
import { IUserModel } from '../models/interfaces/user-model';
import { IAliceFields, IToken } from '../interfaces/common-interfaces';
import * as RandomString from 'randomstring';
import * as md5 from 'md5';
import * as _ from 'lodash';
import * as Joi from 'joi';
import { validate } from '../utils/joi-util';
import { sendEmail } from '../utils/node-mailer-util';
import * as UserFcmTokensService from './user-fcm-tokens';
import * as moment from 'moment';
import { SubscriptionType } from '../constants/subscription-type';

const userModel = new UserModel();


export const getUsers = async () => {
  const users = await userModel.getUser();

  return users;
}
export const getUserById = async (id: number): Promise<IUserModel | undefined> => {
  const user = await userModel.getById(id);
  return _.head(user);
};

export const createUser = async (user: any) => {
  const realPassword = user.password || '';
  user.password = md5(user.password || '');
  user.token = RandomString.generate({length: 20});
  user.subscriptionExpireOn = moment().add(7, 'day').toDate();
  // for FCM TOKEN
  const fcmToken = user.fcmToken;
  delete user.fcmToken;
  
  const registeredUser = await userModel.storeUser(user);


  // const dbUser = await getUserByEmailAndPassword(user.email, realPassword, fcmToken);
  // await UserSymbolsService.selectUserSymbolsBySymbolNames(dbUser!!.id, [
  //   'CRUDEOIL',
  //   'GOLD',
  //   'SILVER',
  //   'COPPER',
  //   'NATURALGAS',
  //   'NICKEL',
  //   'ZINC',
  //   'LEAD',
  //   'ALUMINIUM',
  //   'BANKNIFTY',
  //   'NIFTY',
  // ]);
  // return dbUser;

  return registeredUser;
};

export const getUserByEmailAndPassword = async (email: string, password: string, fcmToken?: string)
  : Promise<IUserModel | null> => {
  let users: IUserModel[] = await userModel
    .getByEmailAndPassword(email, md5(password))
    .columns([UserModel.COL_TOKEN]);

  let user = _.head(users);

  if (!user) {
    users = await userModel
      .getByEmailAndTemporaryPassword(email, md5(password))
      .columns([UserModel.COL_TOKEN]);
    user = _.head(users);
    if (user) {
      user.isByTemporaryPassword = true;
    }
  } else {
    user.isByTemporaryPassword = false;
  }
  if (!user) {
    return null;
  }
  embedAuthorizationIntoUser(user);
  // update fcmToken
  if (fcmToken) {
    await UserFcmTokensService.deleteFcmToken(fcmToken);
    await UserFcmTokensService.insertFcmToken(user.id, fcmToken);
  }
  return user;
};

export const getUserByEmail = async (email: string): Promise<IUserModel | undefined> => {
  const users = await userModel.getByEmail(email);
  return _.head(users);
};

export const getUserByAliceUsername = async (aliceUsername: string): Promise<IUserModel | undefined> => {
  const users = await userModel.getByAliceUsername(aliceUsername);
  return _.head(users);
};

export const getUserByAliceUsernameWithPrivateFields =
  async (aliceUsername: string): Promise<IUserModel | undefined> => {
    const users = await userModel.getByAliceUsername(aliceUsername)
      .columns(
        UserModel.COL_ALICE_USERNAME,
        UserModel.COL_ALICE_PASSWORD,
        UserModel.COL_ALICE_ANSWER,
        UserModel.COL_ALICE_TOKEN);
    return _.head(users);
  };

export const getUserByPhoneNumber = async (phoneNumber: string): Promise<IUserModel | undefined> => {
  const users = await userModel.getByPhoneNumber(phoneNumber);
  return _.head(users);
};

export const getUserByIToken = async (iToken: IToken): Promise<IUserModel | undefined> => {
  const users = await userModel.getByIToken(iToken);
  return _.head(users);
};

export const getUserByIdWithToken = async (id: number): Promise<IUserModel | undefined> => {
  const users = await userModel.getById(id)
    .column(UserModel.COL_TOKEN);
  return _.head(users);
};

export const getAliceUsers = async (query: any, offset: number, limit: number): Promise<IUserModel[]> => {
  return userModel.getByAliceUserType(query, offset, limit);
};

export const getAliceUsersCount = async (query: any): Promise<IUserModel[]> => {
  return userModel.getCountByAliceUserType(query);
};

export const forgotPassword = async (user: IUserModel) => {
  const tempPw = RandomString.generate({length: 6, readable: true});
  await userModel.updateUserTemporaryPassword(user.id, md5(tempPw));
  sendEmail(
    user.email,
    'Forgot Password?',
    `You temporary password is ${tempPw}. Use this to login into your account`);
};

export const changePassword = async (userId: number, password: string) => {
  await userModel.updateUserTemporaryPassword(userId, null);
  await userModel.updateUserPassword(userId, md5(password));
};

export const updateAliceToken = async (userId: number, aliceToken: string) => {
  await userModel.updateAliceToken(userId, aliceToken);
};

export const updateAliceFields = async (userId: number, aliceFields: IAliceFields) => {
  await userModel.updateAliceFields(userId, aliceFields);
};

export const updateUserSubscription =
  async (userId: number, subscriptionType: SubscriptionType, subscriptionExpireOn?: Date) => {
    return userModel.update({
      subscriptionType,
      subscriptionExpireOn,
    } as IUserModel, {id: userId});
  };

export const logoutAlice = async (userId: number) => {
  await userModel.updateAliceFields(userId, {
    aliceUsername: null,
    aliceAnswer: null,
    alicePassword: null,
    aliceToken: null,
    aliceBranchCode: null,
  });
};

// ----------------------------------HELPER FUNCTIONS---------------------------------------//
export const embedAuthorizationIntoUser = (user: IUserModel) => {
  user.authorization = encodedAuthorizationToken({
    id: user.id,
    email: user.email,
    token: user.token || '',
  });
  delete user.token;
};
const encodedAuthorizationToken = (token: IToken): string => {
  return Buffer.from(JSON.stringify(token)).toString('base64');
};

export const decodeAuthorizationToken = (authorization: string): IToken | null => {
  try {
    const tokenString = Buffer.from(authorization, 'base64').toString('ascii');
    const decodedToken = JSON.parse(tokenString);
    validate(decodedToken, {
      id: Joi.number().required(),
      email: Joi.string().required(),
      token: Joi.string().required(),
    });
    return decodedToken;
  } catch (err) {
    return null;
  }
};

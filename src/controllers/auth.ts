import { Context } from 'koa';
import * as UsersServices from '../services/users';
import { INext } from '../interfaces/next';
import { unauthorizedWithKey } from '../utils/boom-util';
import { Keys } from '../constants/keys';
import { IAliceProfile } from '../interfaces/common-interfaces';
import { UserType } from '../constants/user-type';
import { IUserModel } from '../models/interfaces/user-model';
import * as AliceApiService from '../services/alice-api';
import * as config from 'config';
import { IAdminConfig } from '../interfaces/admin-config';

export const createUser = async (ctx: Context,next:INext) => {

  const user = await UsersServices.createUser(ctx.request.body);

  ctx.response.body = user;

  if(!user){
    console.log("unabel to create user!");
  }
  ctx.state.data = user;
  console.log("created user is:",ctx.state.data);


  await next();
};

export const loginUser = async (ctx: Context, next: INext) => {
  const user = await UsersServices.getUserByEmailAndPassword(
    ctx.request.body.email,
    ctx.request.body.password,
    ctx.request.body.fcmToken);

    ctx.response.body = user;
  if (!user) {
    throw unauthorizedWithKey('Invalid email or password', Keys.UNAUTHORIZED_MAIN);
  }
  ctx.state.data = user;
  console.log("loggedin  user data is:",ctx.state.data)
  await next();
};

export const loginAlice = async (ctx: Context, next: INext) => {
  const aliceProfile: IAliceProfile = ctx.state.aliceProfile;
  const body = ctx.state.body;
  const aliceBranchCode = await AliceApiService.getBranchCode(body.username);
  let session: IUserModel | undefined;
  if (ctx.state.session) {
    await UsersServices.updateAliceFields(ctx.state.session.id, {
      aliceUsername: body.username,
      alicePassword: body.password,
      aliceAnswer: body.answer,
      aliceToken: aliceProfile.token,
      aliceBranchCode,
    });
    session = await UsersServices.getUserById(ctx.state.session.id);
  } else {
    const userByEmail = await UsersServices.getUserByEmail(aliceProfile.email);
    const userByAliceUsername = await UsersServices.getUserByAliceUsername(aliceProfile.username);
    if (
      userByEmail ||
      userByAliceUsername) {
      // TODO logout kite
      // TODO logout upstox
      await UsersServices.updateAliceFields(
        userByEmail ? userByEmail.id : userByAliceUsername!!.id, {
          aliceUsername: body.username,
          alicePassword: body.password,
          aliceAnswer: body.answer,
          aliceToken: aliceProfile.token,
          aliceBranchCode,
        });
      session = userByEmail || userByAliceUsername;
    } else {
      await UsersServices.createUser({
        name: aliceProfile.name,
        email: aliceProfile.email,
        aliceUsername: body.username,
        alicePassword: body.password,
        aliceAnswer: body.answer,
        aliceToken: aliceProfile.token,
        aliceBranchCode,
        fcmToken: body.fcmToken,
        userType: UserType.ALICE,
      });
      session = await UsersServices.getUserByAliceUsername(aliceProfile.username);
    }
  }
  if (session) {
    session = await UsersServices.getUserByIdWithToken(session.id);
    session!!.isByTemporaryPassword = false;
    UsersServices.embedAuthorizationIntoUser(session!!);
  }
  ctx.state.data = session;
  await next();
};

export const loginAdmin = async (ctx: Context, next: INext) => {
  const adminConfig = config.get<IAdminConfig>('admin');
  if (ctx.state.body.username !== adminConfig.username || ctx.state.body.password !== adminConfig.password) {
    throw unauthorizedWithKey('Invalid username or password', Keys.UNAUTHORIZED_ADMIN);
  }
  ctx.state.data = adminConfig.token;
  await next();
};

export const logoutAlice = async (ctx: Context, next: INext) => {
  await UsersServices.logoutAlice(ctx.state.session.id);
  ctx.state.data = null;
  await next();
};
export const getProfile = async (ctx: Context, next: INext) => {
  ctx.state.data = await UsersServices.getUserById(ctx.state.session.id);
  await next();
};

export const forgotPassword = async (ctx: Context, next: INext) => {
  await UsersServices.forgotPassword(ctx.state.user);
  ctx.state.data = null;
  await next();
};

export const changePassword = async (ctx: Context, next: INext) => {
  await UsersServices.changePassword(ctx.state.session.id, ctx.state.body.newPassword);
  ctx.state.data = null;
  await next();
};

export const signupAlice = async (ctx: Context, next: INext) => {
  ctx.state.data = await AliceApiService.requestSignup(ctx.state.body);
  await next();
};

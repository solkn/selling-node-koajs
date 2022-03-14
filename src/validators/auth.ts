import { Context } from 'koa';
import { INext } from '../interfaces/next';
import { validate } from '../utils/joi-util';
import * as Joi from 'joi';
import * as UsersService from '../services/users';
import * as Boom from 'boom';
import { Keys } from '../constants/keys';
import { firebaseAdmin } from '../utils/firebase-util';
import * as randomString from 'randomstring';
import * as AliceApiService from '../services/alice-api';

export const createUser = async (ctx: Context, next: INext) => {
  ctx.state.body = validate(ctx.request.body, {
    name: Joi.string().max(100).required(),
    email: Joi.string().email().max(100).lowercase().required(),
    password: Joi.string().max(100).required(),
    //idToken: Joi.string().required(),
    //fcmToken: Joi.string().max(250),
  });
  const emailUser = await UsersService.getUserByEmail(ctx.state.body.email);
  if (emailUser) {
    throw Boom.conflict('Email address already exists', Keys.CONFLICT_EMAIL);
  }

  // let phoneNumber: string;
  // try {
  //   if (process.env.NODE_ENV === 'localhost') {
  //     phoneNumber = `+91${randomString.generate({length: 10, charset: 'numeric'})}`;
  //   } else {
  //     const firebaseUser: any = await firebaseAdmin.auth().verifyIdToken(ctx.state.body.idToken);
  //     phoneNumber = firebaseUser.phone_number;
  //   }
  // } catch (e) {
  //   throw Boom.unauthorized('Invalid idToken');
  // }

  // const phoneNumUser = await UsersService.getUserByPhoneNumber(phoneNumber);
  // if (phoneNumUser) {
  //   throw Boom.conflict('Phone number already exists', Keys.CONFLICT_PHONE_NUMBER);
  // }
  // ctx.state.body.phoneNumber = phoneNumber;
  // delete ctx.state.body.idToken;
  await next();
};

export const loginUser = async (ctx: Context, next: INext) => {
  ctx.state.body = validate(ctx.request.body, {
    email: Joi.string().email().max(100).lowercase().required(),
    password: Joi.string().max(100).required(),
    fcmToken: Joi.string().max(250),
  });
  await next();
};

export const loginAlice = async (ctx: Context, next: INext) => {
  ctx.state.body = validate(ctx.request.body, {
    username: Joi.string().max(50).uppercase().required(),
    password: Joi.string().max(100).required(),
    answer: Joi.string().max(250).required(),
    fcmToken: Joi.string().max(250),
  });
  ctx.state.aliceProfile = await AliceApiService.loginAndTwfoAndProfile(ctx.state.body);

  const userByAliceUsername = await UsersService.getUserByAliceUsername(ctx.state.body.username);
  if (ctx.state.session) {
    if (userByAliceUsername && userByAliceUsername.id !== ctx.state.session.id) {
      throw Boom.conflict(`'${ctx.state.body.username}' ` +
        `is already attached to other account having email address ${userByAliceUsername.email}. ` +
        'Please login from this account if you own it. Otherwise contact us at contact-us@optimumlevel.in');
    }
  }

  await next();
};

export const loginAdmin = async (ctx: Context, next: INext) => {
  ctx.state.body = validate(ctx.request.body, {
    username: Joi.string().max(100).lowercase().required(),
    password: Joi.string().max(100).required(),
  });
  await next();
};

export const forgotPassword = async (ctx: Context, next: INext) => {
  const body = validate(ctx.request.body, {
    email: Joi.string().email().max(250).lowercase().required(),
  });

  const user = await UsersService.getUserByEmail(body.email);
  if (!user) {
    ctx.throw(Boom.notFound('Email address not found'));
  }
  ctx.state.body = body;
  ctx.state.user = user;
  await next();
};

export const changePassword = async (ctx: Context, next: INext) => {

  ctx.state.body = validate(ctx.request.body, {
    currentPassword: Joi.string().max(250).required(),
    newPassword: Joi.string().max(250).required()
  });

  const user = await UsersService.getUserByEmailAndPassword(ctx.state.session.email, ctx.state.body.currentPassword);
  if (!user) {
    ctx.throw(Boom.notFound('Invalid current password'));
  }
  ctx.state.user = user;
  await next();
};

export const signupAlice = async (ctx: Context, next: INext) => {
  ctx.state.body = validate(ctx.request.body, {
    name: Joi.string().max(250).required().uppercase(),
    email: Joi.string().email().max(250).required(),
    phoneNumber: Joi.string().max(250).required(),
    state: Joi.string().max(250).required(),
    city: Joi.string().max(250).required(),
  });
  await next();
};

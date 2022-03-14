import { Context } from 'koa';
import { INext } from '../interfaces/next';
import { validate } from '../utils/joi-util';
import * as Joi from 'joi';
import { SubscriptionType } from '../constants/subscription-type';
import * as Boom from 'boom';
import * as UsersService from '../services/users';
import { logInfo } from '../utils/logger';

export const generateOrder = async (ctx: Context, next: INext) => {
  ctx.state.body = validate(ctx.request.body, {
    subscriptionType: Joi.object().keys({
      levelsSignals:Joi.string().validate(SubscriptionType.LEVELS_SIGNALS),
      levelsSignalsTrade:Joi.string().validate(SubscriptionType.LEVELS_SIGNALS_TRADE),

    }),
  });
  const subscriptionType: SubscriptionType = ctx.state.body.subscriptionType;
  const session = ctx.state.session;

  if (session.subscriptionType === subscriptionType && session.subscriptionExpireOn.getTime() > Date.now()) {
    throw Boom.badRequest('You are already subscribed to this subscription');
  }

  if (session.subscriptionType === SubscriptionType.LEVELS_SIGNALS_TRADE &&
    session.subscriptionExpireOn.getTime() > Date.now()) {
    throw Boom.badRequest('You can\'t downgrade your subscribe until is expired');
  }

  await next();
};

export const razorPaymentAuthorizedWebHook = async (ctx: Context, next: INext) => {
  try {
    logInfo(ctx.request.body || 'no body hit');
    const payload = ctx.request.body.payload.payment.entity;
    const body: any = {
      accountId: ctx.request.body.account_id,
      subscriptionType: payload.notes.subscriptionType,
      orderId: payload.order_id,
      paymentId: payload.id,
      amount: (payload.amount) / 100,
      currency: payload.currency,
      method: payload.method,
      bank: payload.bank,
      email: payload.email,
      phoneNumber: payload.contact,
      paidOn: payload.created_at
    };
    ctx.state.body = validate(body, {
      accountId: Joi.string().required(),
      // subscriptionType: Joi.string().only(
      //   SubscriptionType.LEVELS_SIGNALS,
      //   SubscriptionType.LEVELS_SIGNALS_TRADE).required(),
      
      subscriptionType: Joi.object().keys({
        levelsSignals:Joi.string().validate(SubscriptionType.LEVELS_SIGNALS),
        levelsSignalsTrade:Joi.string().validate(SubscriptionType.LEVELS_SIGNALS_TRADE),
  
      }).required(),
      orderId: Joi.string().required(),
      paymentId: Joi.string().required(),
      amount: Joi.number().required(),
      currency: Joi.string().required(),
      method: Joi.string().required(),
      bank: Joi.string().allow(null),
      email: Joi.string().required(),
      phoneNumber: Joi.string(),
      paidOn: Joi.date().timestamp('unix').required(),
    }, true);
    const user = await UsersService.getUserByEmail(payload.notes.email || 'n/a');
    if (!user) {
      throw Boom.notFound('Email not found');
    }
    ctx.state.user = user;
  } catch (e) {
    ctx.state.message = e.toString();
    ctx.state.data = null;
  }
  await next();
};

export const getAliceSubscriptions = async (ctx: Context, next: INext) => {
  ctx.state.query = validate(ctx.request.query, {
    startDate: Joi.date(),
    endDate: Joi.date()
  }, true);

  await next();
};

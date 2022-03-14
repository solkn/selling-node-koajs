import { Context } from 'koa';
import { INext } from '../interfaces/next';
import * as RazorPayService from '../services/razorpay';
import * as UserPaymentsService from '../services/user-payments';
import * as UsersService from '../services/users';
import * as moment from 'moment';
import { IUserModel } from '../models/interfaces/user-model';
import { SubscriptionType } from '../constants/subscription-type';
import {
  AMOUNT_PREMIUM_PACK_PER_DAY,
  AMOUNT_PREMIUM_PACK_PER_MONTH,
  AMOUNT_STARTER_PACK_PER_DAY,
  AMOUNT_STARTER_PACK_PER_MONTH
} from '../constants/common-constants';

export const generateOrder = async (ctx: Context, next: INext) => {
  const subscriptionType: SubscriptionType = ctx.state.body.subscriptionType;
  const session = ctx.state.session;
  let amount = AMOUNT_STARTER_PACK_PER_MONTH;

  if (subscriptionType === SubscriptionType.LEVELS_SIGNALS_TRADE) {
    if (session.subscriptionType !== SubscriptionType.TRIAL && session.subscriptionExpireOn.getTime() > Date.now()) {
      let daysRemainingInExp = (session.subscriptionExpireOn.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      daysRemainingInExp = daysRemainingInExp > 30 ? 30 : daysRemainingInExp;
      amount = (AMOUNT_PREMIUM_PACK_PER_DAY * daysRemainingInExp) - (AMOUNT_STARTER_PACK_PER_DAY * daysRemainingInExp);
    } else {
      amount = AMOUNT_PREMIUM_PACK_PER_MONTH;
    }
  }
  ctx.state.data = await RazorPayService.createOrder(amount, session.email, subscriptionType);
  await next();
};

export const razorPaymentAuthorizedWebHook = async (ctx: Context, next: INext) => {
  if (ctx.state.data === null) {
    await next();
    return;
  }
  const user: IUserModel = ctx.state.user;
  const newSubscriptionType: SubscriptionType = ctx.state.body.subscriptionType;
  const oldUserPayment = await UserPaymentsService.getUserPaymentByPaymentId(ctx.state.body.paymentId);
  if (!oldUserPayment) {
    await UserPaymentsService.createUserPayment({
      userId: user.id,
      ...ctx.state.body,
    });
    // let subscriptionExpireOn = user.subscriptionExpireOn;
    // if (subscriptionExpireOn.getTime() < Date.now()) {
    //   subscriptionExpireOn = moment().toDate();
    // }
    let shouldAddDays = true;
    if (user.subscriptionType === SubscriptionType.LEVELS_SIGNALS
      && newSubscriptionType === SubscriptionType.LEVELS_SIGNALS_TRADE
     // && user.subscriptionExpireOn.getTime() > Date.now()
    ) {
      shouldAddDays = false;
    }
    await UsersService.updateUserSubscription(
      user.id,
      newSubscriptionType,
      //moment(subscriptionExpireOn).add(shouldAddDays ? 30 : 0, 'day').toDate(),
    );
  }
  ctx.state.data = null;
  await next();
};

export const getAliceSubscriptions = async (ctx: Context, next: INext) => {
  const totalAmount = await UserPaymentsService.getAliceUserPaymentsTotalAmountOfAlice(ctx.state.query);
  const userPayments = await UserPaymentsService.getAliceUserPayments(
    ctx.state.query,
    ctx.state.offset,
    ctx.state.limit);
  ctx.state.totalCount = await UserPaymentsService.getCountOfAliceUserPayments(ctx.state.query);
  ctx.state.data = {
    userPayments,
    totalAmount
  };
  await next();
};

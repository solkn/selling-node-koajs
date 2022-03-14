import { Context } from 'koa';
import { INext } from '../interfaces/next';
import * as SignalsService from '../services/signals';
import { SignalType } from '../constants/signal-type';
import * as UserFcmTokensService from '../services/user-fcm-tokens';
import * as _ from 'lodash';
import { cond } from 'lodash';


export const getSignals = async (ctx:Context)=>{
    const signals = await SignalsService.getSignals();
   
    ctx.response.body = signals;

    var signalObject = JSON.parse(JSON.stringify(ctx.response.body));

    console.log("signals are:",signalObject);

    return signals;
}
export const getSignalById = async(ctx:Context)=>{
  
  const signal = await SignalsService.getSignalById(ctx.params.id);
  
  ctx.response.body = signal;

  if(!signal){
    console.log("no signal in this Id!");
  }
  const userObject = JSON.parse(JSON.stringify(signal));
  console.log("user data:",userObject);

  return signal;

   

}

export const createSignal = async (ctx: Context) => {

  const signal = await SignalsService.createSignal(ctx.request.body);

  ctx.response.body = signal;

  if(!signal){
    console.log("unable to create signal");
  }
    
  return signal;
};

export const createOrUpdateSignal = async (ctx: Context, next: INext) => {
  const signalType: SignalType = ctx.params.signalType;
  let signalId: number;
  if (signalType === SignalType.BUY || signalType === SignalType.SELL) {
    const result: number[] = await SignalsService.createSignal(ctx.request.body);
    ctx.response.body = result;
    signalId = _.head(result)!!;
  } else {
    //await SignalsService.updateSignal(ctx.state.signal.id, ctx.state.body);
    await SignalsService.updateSignal(ctx.request.body);
    signalId = ctx.state.signal.id;
  }
  const signal = await SignalsService.getSignalById(signalId);
  await UserFcmTokensService.sendPushNotificationToSubscribedUsersAboutSignal(signal!!, signalType);
  ctx.state.data = null;
  await next();
};

export const getAllUserSignals = async (ctx: Context, next: INext) => {
  const signals = await SignalsService
    .getAllRecentUserSignals(ctx.params.id, ctx.state.offset, ctx.state.limit);

  ctx.response.body = signals;
  await next();
};

export const updateSignal  = async (ctx:Context)=>{
 
   const oldSignal = await SignalsService.getSignalById(ctx.params.id);
   console.log("old signal is:",oldSignal);
   const updatedSignal = await SignalsService.updateSignal(JSON.parse(JSON.stringify(oldSignal)));

   ctx.response.body = updatedSignal;

   console.log("updated signal is:",ctx.response.body);

   return updatedSignal;
};

export const deleteSignal  = async (ctx:Context)=>{
  
  const deletedSignal = await SignalsService.deleteSignal(ctx.params.id);
  
  return deletedSignal ;
};
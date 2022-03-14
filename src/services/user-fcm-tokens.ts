import { UserFcmTokenModel } from '../models/classes/model';
import { IUserFcmTokenModel } from '../models/interfaces/user-fcm-token-model';
import { ISignalModel } from '../models/interfaces/signal-model';
import { SignalType } from '../constants/signal-type';
import { firebaseAdmin } from '../utils/firebase-util';

const userFcmTokenModel = new UserFcmTokenModel();

export const deleteFcmToken = (fcmToken: string) => {
  return userFcmTokenModel.delete({
    fcmToken
  });
};

export const insertFcmToken = (userId: number, fcmToken: string) => {
  return userFcmTokenModel.insert(
    {
      userId,
      fcmToken,
    } as IUserFcmTokenModel
  );
};

export const getFcmTokensByUserIds = (userIds: number[]): Promise<IUserFcmTokenModel> => {
  return userFcmTokenModel.getByUserIds(userIds);
};

export const sendPushNotificationToSubscribedUsersAboutSignal =
  async (signal: ISignalModel, signalType: SignalType) => {
    const usersFcmTokens: IUserFcmTokenModel[] = await userFcmTokenModel.getBySubscribedUsers({
      symbolName: signal.symbolName,
      exchange: signal.exchange,
    });
    const fcmTokens = usersFcmTokens.map((value) => value.fcmToken);
    let nBody = 'N/A';
    switch (signalType) {
      case SignalType.BUY:
      case SignalType.SELL:
        nBody = `${signalType.toUpperCase()} ${signal.symbolName} at ${signal.price}, SL ${signal.stopLoss}`;
        break;
      case SignalType.STOP_LOSS:
        nBody = `Stoploss Triggered in ${signal.symbolName} at ${signal.stopLoss}`;
        break;
      case SignalType.TARGET_1:
        nBody = `Target 1 achieved in ${signal.symbolName} with profit ${signal.profit1}INR`;
        break;
      case SignalType.TARGET_2:
        nBody = `Target 2 achieved in ${signal.symbolName} with profit ${signal.profit2}INR`;
        break;
      case SignalType.TARGET_3:
        nBody = `Target 3 achieved in ${signal.symbolName} with profit ${signal.profit3}INR`;
        break;
    }
    if (fcmTokens.length === 0) {
      return;
    }
    firebaseAdmin.messaging().sendToDevice(fcmTokens, {
      data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
      notification: {
        title: `New Signal - ${signal.symbolName}/${signal.exchange}`,
        body: nBody,
        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
      }
    }, {
      priority: 'high',
    });
  };

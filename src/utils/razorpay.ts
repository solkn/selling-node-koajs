import * as Razorpay from 'razorpay';
import * as config from 'config';

const razorPayConfig = config.get<any>('razorPay');
export const razorPay = new Razorpay({
    key_id: razorPayConfig.keyId,
    key_secret: razorPayConfig.keySecret,
  }
);

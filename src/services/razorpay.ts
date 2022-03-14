import { razorPay } from '../utils/razorpay';
import { SubscriptionType } from '../constants/subscription-type';

export const createOrder = async (amount: number, sessionEmail: string, subscriptionType: SubscriptionType) => {
    const gstOfAmount = amount / 100 * 18;
    amount = amount + gstOfAmount;
    const response = await razorPay.orders.create({
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: '123',
        payment_capture: true,
        notes: {
            email: sessionEmail,
            subscriptionType,
        },
    });
    return {
        orderId: response.id,
    };
};

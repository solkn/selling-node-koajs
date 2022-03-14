import * as Router from 'koa-router';

import * as SubscriptionController from '../controllers/subscription';
import * as SubscriptionValidator from '../validators/subscription';
import { authorizeUser } from '../middlewares/user-authorization';
import { adminAuthorization } from '../middlewares/admin-authorization';

const router = new Router({
  prefix: '/api/v1/subscription'
});

router.post('/order',
  authorizeUser(),
  SubscriptionValidator.generateOrder,
  SubscriptionController.generateOrder);

router.post('/web-hook/payment/authorized',
  SubscriptionValidator.razorPaymentAuthorizedWebHook,
  SubscriptionController.razorPaymentAuthorizedWebHook);

router.get('/payments/alice',
  adminAuthorization(),
  SubscriptionValidator.getAliceSubscriptions,
  SubscriptionController.getAliceSubscriptions);

export default router.routes();

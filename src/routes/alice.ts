import * as Router from 'koa-router';

import * as AliceController from '../controllers/alice';
import * as AliceValidator from '../validators/alice';
import { authorizeUser } from '../middlewares/user-authorization';
import { aliceAuthorization } from '../middlewares/alice-authorization';

const router = new Router({
  prefix: '/api/v1/alice'
});

router.post('/bracket-order',
  authorizeUser({isTradeSubscriptionRequired: true}),
  aliceAuthorization(),
  AliceValidator.placeBracketOrder,
  AliceController.placeBracketOrder);

router.post('/cover-order',
  authorizeUser({isTradeSubscriptionRequired: true}),
  aliceAuthorization(),
  AliceValidator.placeCoverOrder,
  AliceController.placeCoverOrder);

export default router.routes();

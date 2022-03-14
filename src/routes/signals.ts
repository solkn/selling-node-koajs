import * as Router from 'koa-router';

import * as SignalsController from '../controllers/signals';
import * as SignalsValidator from '../validators/signals';
import { authorizeUser } from '../middlewares/user-authorization';

const router = new Router({
  prefix: '/api/v1/signals'
});
router.post('/',
  SignalsController.createSignal);
router.post('/:signalType',
  // authorizeRobot,
  SignalsValidator.createOrUpdateSignal,
  SignalsController.createOrUpdateSignal);
router.get('/:all',
  SignalsController.getSignals);
router.get('/:id',
  SignalsController.getSignalById);   
router.get('/',
  authorizeUser(),
  SignalsController.getAllUserSignals);
router.get('/all',
  authorizeUser(),
  SignalsController.getSignals);
router.put('/:id',
  //authorizeUser,
  SignalsController.updateSignal);
router.delete('/:id',
  //authorizeUser,
  SignalsController.deleteSignal);
export default router.routes();

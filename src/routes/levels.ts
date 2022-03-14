import * as Router from 'koa-router';

import * as LevelsController from '../controllers/levels';
import * as LevelsValidator from '../validators/levels';
import { authorizeUser } from '../middlewares/user-authorization';

const router = new Router({
  prefix: '/api/v1/levels'
});

router.post('/',
  // authorizeRobot,
  //LevelsValidator.createLevel,
  LevelsController.createLevel);


router.get('/all',
  //authorizeUser,
  LevelsController.getLevels);
router.get('/:id',
  //authorizeUser,
  LevelsController.getLevelById);   
router.get('/',
  //authorizeUser(),
  LevelsController.getAllUserLevels);

router.get('/order-histories',
  authorizeUser(),
  LevelsController.getLevelOrderHistories);

export default router.routes();

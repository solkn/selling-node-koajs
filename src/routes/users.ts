import * as Router from 'koa-router';

import * as UsersController from '../controllers/users';
import * as UsersValidator from '../validators/users';
import { authorizeUser } from '../middlewares/user-authorization';
import { adminAuthorization } from '../middlewares/admin-authorization';

const router = new Router({
  prefix: '/api/v1/users'
});

router.get('/',
  //authorizeUser(),
  UsersController.getProfile);
router.get('/all',
   //authorizeUser,
   UsersController.getUsers);  
router.get('/:id',
   //authorizeUser(),
   UsersController.getUserById);
router.get('/symbols',
  authorizeUser(),
  UsersController.getSymbolsByUserId);

router.put('/symbols',
  authorizeUser(),
  UsersValidator.selectUserSymbols,
  UsersController.selectUserSymbols);

router.get('/alice',
  adminAuthorization(),
  UsersValidator.getAliceUsers,
  UsersController.getAliceUsers);

export default router.routes();

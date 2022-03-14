import * as Router from 'koa-router';

import * as AuthController from '../controllers/auth';
import * as AuthValidator from '../validators/auth';
import { authorizeUser } from '../middlewares/user-authorization';

const router = new Router({
  prefix: '/api/v1/auth'
});

router.post('/signup',AuthValidator.createUser, AuthController.createUser);
router.post('/signup-alice',AuthController.signupAlice);

router.post('/login',AuthValidator.loginUser, AuthController.loginUser);
router.post('/login-alice',
  authorizeUser({isOptional: true}),
  AuthValidator.loginAlice,
  AuthController.loginAlice);
router.post('/login-admin',
  AuthValidator.loginAdmin,
  AuthController.loginAdmin);
router.post('/logout-alice',
  authorizeUser(),
  AuthController.logoutAlice);
router.post('/forgot-password', AuthValidator.forgotPassword, AuthController.forgotPassword);
router.post('/change-password',
  authorizeUser(),
  AuthValidator.changePassword,
  AuthController.changePassword);
router.get('/profile', authorizeUser(), AuthController.getProfile);

export default router.routes();

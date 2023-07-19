import * as express from 'express';
const router = express.Router();
import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';
import { authenticate } from '../middleware/authMiddleware';
const userController = new UserController();
const authController = new AuthController();

router.post('/signup', userController.signup);
router.put('/user/update',authenticate, userController.updateUser);
router.put('/user/password',authenticate, userController.updatePassword);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/', userController.resetPassword);


router.post('/login', authController.login);

export default router;
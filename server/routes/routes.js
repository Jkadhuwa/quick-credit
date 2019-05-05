import express from 'express';
import v1 from './apiv1';
import authController from '../controllers/authController';

const router = express.Router();

router.use('/', v1);

// Authentication routes
router.post('/auth/signup', authController.createUser);
router.post('/auth/signin', authController.loginUser);

export default router;

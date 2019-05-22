import express from 'express';
import tokenVer from '../middlewares/middlewares';
import usersController from '../controllers/usersController';

import Validation from '../middlewares/validator';

const router = express.Router();

// Authentication routes
router.post('/auth/signup', [Validation.validateSignup, Validation.validatenewEmail], usersController.createUser);
router.post('/auth/signin', [Validation.validateLogin], usersController.login);

router.get(
	'/users',
	[tokenVer.checkToken, tokenVer.checkAdmin],
	usersController.getAllUsers
);
router.get('/users/:userEmail', [tokenVer.checkToken, tokenVer.checkAdmin],
	usersController.getUser);


export default router;

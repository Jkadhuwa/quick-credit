import express from 'express';
import tokenVer from '../middlewares/middlewares';
import usersController from '../controllers/usersController';
import loanController from '../controllers/loanController';
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
router.post('/loans', [Validation.validateApplication, tokenVer.checkToken, tokenVer.loanVerifier], loanController.applyLoan);

export default router;

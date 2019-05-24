import express from 'express';
import tokenVer from '../middlewares/middlewares';
import usersController from '../controllers/usersController';
import loanController from '../controllers/loanController';
import Validation from '../middlewares/validator';

const router = express.Router();

// Authentication routes
router.post('/auth/signup', [Validation.validatenewEmail, Validation.validateSignup], usersController.createUser);
router.post('/auth/signin', [Validation.validateLogin], usersController.login);

router.get(
	'/users',
	[tokenVer.checkToken, tokenVer.checkAdmin],
	usersController.getAllUsers
);
router.get('/users/:userEmail', [tokenVer.checkToken, Validation.validateEmail, tokenVer.checkAdmin],
	usersController.getUser);

router.patch(
	'/users/:userEmail/verify',
	[tokenVer.checkToken, Validation.validateEmail, tokenVer.checkAdmin],
	usersController.markVerified
);

router.post('/loans', [Validation.validateApplication, tokenVer.checkToken, tokenVer.loanVerifier], loanController.applyLoan);

router.patch(
	'/loans/:loanId',
	[tokenVer.checkToken, Validation.validateId, Validation.verifyloanStatus, tokenVer.checkAdmin],
	loanController.approveOrReject
);
router.get(
	'/loans',
	[tokenVer.checkToken, tokenVer.checkAdmin],
	loanController.getAllLoans
);

router.get(
	'/loans/:loanId',
	[tokenVer.checkToken, Validation.validateId, tokenVer.checkAdmin],
	loanController.getLoan
);

router.post(
	'/loans/:loanId/repayments',
	[tokenVer.checkToken, Validation.validateRepayment, tokenVer.repaymentVerifier, Validation.validateId, tokenVer.checkAdmin],
	loanController.repayLoan
);

export default router;

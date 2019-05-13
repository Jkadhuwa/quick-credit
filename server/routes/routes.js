import express from 'express';
import v1 from './apiv1';
import authController from '../controllers/authController';
import loanController from '../controllers/loanController';
import tokenVer from '../middlewares/middlewares';
import usersController from '../controllers/usersController';
import validator from '../helpers/validator';
// import joi from '@hapi/joi';

const router = express.Router();

router.use('/', v1);

// Authentication routes
router.post('/auth/signup', [validator.validate], authController.createUser);
router.post(
	'/auth/signin',
	[validator.validateLogin],
	authController.loginUser
);

// Loan routes
router.post(
	'/loans',
	[validator.validateLoan, tokenVer.checkToken],
	loanController.applyLoan
);
router.get(
	'/loans',
	[tokenVer.checkToken, tokenVer.checkAdmin],
	loanController.getLoans
);
router.get(
	'/loans/:loanId',
	[tokenVer.checkToken, tokenVer.checkAdmin],
	loanController.getLoan
);
router.patch(
	'/loans/:loanId',
	[tokenVer.checkToken, tokenVer.checkAdmin],
	loanController.approveOrReject
);
router.post(
	'/loans/:loanId/repayments',
	[tokenVer.checkToken, tokenVer.checkAdmin],
	loanController.createRepayments
);
router.get(
	'/loans/:loanId/repayments',
	[tokenVer.checkToken, tokenVer.checkAdmin],
	loanController.getRepaymets
);

// Users routes
router.patch(
	'/users/:userEmail/verify',
	[tokenVer.checkToken, tokenVer.checkAdmin],
	usersController.markVerified
);
router.get(
	'/users',
	[tokenVer.checkToken, tokenVer.checkAdmin],
	usersController.getAllUsers
);
export default router;

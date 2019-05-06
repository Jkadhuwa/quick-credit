import express from 'express';
import v1 from './apiv1';
import authController from '../controllers/authController';
import loanController from '../controllers/loanController';
import tokenVer from '../helpers/middlewares';

const router = express.Router();

router.use('/', v1);

// Authentication routes
router.post('/auth/signup', authController.createUser);
router.post('/auth/signin', authController.loginUser);

// Loan routes
router.post('/loans', tokenVer.checkToken, loanController.applyLoan);
router.get('/loans', tokenVer.checkToken, loanController.getLoans);

export default router;

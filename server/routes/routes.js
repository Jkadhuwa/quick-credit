import express from 'express';
import v1 from './apiv1';
import authController from '../controllers/authController';
import loanController from '../controllers/loanController';
import tokenVer from '../middlewares/middlewares';
import usersController from '../controllers/usersController';

const router = express.Router();

router.use('/', v1);

// Authentication routes
router.post('/auth/signup', authController.createUser);
router.post('/auth/signin', authController.loginUser);

// Loan routes
router.post('/loans', tokenVer.checkToken, loanController.applyLoan);
router.get('/loans', tokenVer.checkToken, loanController.getLoans);
router.get('/loans/:loanId', tokenVer.checkToken, loanController.getLoan);
router.patch(
  '/loans/:loanId',
  tokenVer.checkToken,
  loanController.approveOrReject
);

// Users routes
router.patch(
  '/users/:userEmail/verify',
  tokenVer.checkToken,
  usersController.markVerified
);
router.get('/users', tokenVer.checkToken, usersController.getAllUsers);
export default router;

import express from 'express';
import loanController from '../controllers/loanController';
import tokenVer from '../middlewares/middlewares';
import usersController from '../controllers/usersController';

import Validation from '../middlewares/validator';

const router = express.Router();

// Authentication routes
router.post('/auth/signup', [Validation.validateSignup, Validation.validatenewEmail], usersController.createUser);

export default router;

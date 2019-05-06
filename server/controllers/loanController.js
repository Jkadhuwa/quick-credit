/* eslint-disable import/named */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import data from '../mock_db/database';
import statusCode from '../helpers/statuses';
import {
  paymentInstallment,
  currentDate,
  totalAmount
} from '../helpers/helper';

import { validateLoan } from '../helpers/validator';

class LoanController {
  applyLoan(req, res) {
    for (let i = 0; i < data.users.length; i++) {
      if (data.users[i].token === req.headers['access-token']) {
        const loan = {
          loanId: data.loans.length + 1,
          createdOn: currentDate(),
          user: data.users[i].email,
          amount: req.body.amount,
          tenor: req.body.tenor,
          paymentInstallment: paymentInstallment(
            req.body.amount,
            req.body.tenor
          ),
          status: 'Pending',
          interest: 5 * (req.body.amount / 100),
          totalAmount: totalAmount(req.body.amount),
          amountPaid: 0.0,
          balance: totalAmount(req.body.amount),
          repaid: false
        };
        const currentTotalLoans = parseInt(data.loans.length, 10);
        let currentStatus = 0;
        data.loans.push(loan);
        if (data.loans.length - currentTotalLoans === 1) {
          currentStatus = statusCode.STATUS_CREATED;
        }

        return res.status(currentStatus).send({
          status: currentStatus,
          data: {
            loanId: loan.id,
            createdOn: loan.createdOn,
            firstName: data.users[i].firstName,
            lastName: data.users[i].lastName,
            email: loan.email,
            tenor: loan.tenor,
            amount: loan.amount,
            paymentInstallment: loan.paymentInstallment,
            status: loan.status,
            interest: loan.interest,
            totalAmount: loan.totalAmount,
            amountPaid: loan.amountPaid,
            balance: loan.balance
          }
        });
      }
    }
  }

  getLoans(req, res) {
    for (let i = 0; i < data.users.length; i++) {
      if (data.users[i].token === req.headers['access-token']) {
        if (data.users[i].isAdmin === true) {
          res.status(statusCode.STATUS_OK).send({
            status: statusCode.STATUS_OK,
            data: data.loans
          });
        } else {
          res.status(statusCode.UNAUTHORIZED).send({
            status: statusCode.UNAUTHORIZED,
            error: 'Only previledged users can view '
          });
        }
      }
    }
  }
}
const loanController = new LoanController();
export default loanController;

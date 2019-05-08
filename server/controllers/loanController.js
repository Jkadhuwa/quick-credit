/* eslint-disable import/named */
/* eslint-disable class-methods-use-this */
import data from '../mock_db/database';
import statusCode from '../helpers/statuses';
import {
	paymentInstallment,
	currentDate,
	totalAmount,
	balance
} from '../helpers/helper';

import checkToken from '../middlewares/middlewares';

class LoanController {
	applyLoan(req, res) {
		for (let i = 0; i < data.users.length; i += 1) {
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
					amountPaid: 0,
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
		return true;
	}

	getLoans(req, res) {
		for (let i = 0; i < data.users.length; i += 1) {
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

	getLoan(req, res) {
		for (let i = 0; i < data.users.length; i += 1) {
			if (data.users[i].token === req.headers['access-token']) {
				if (data.users[i].isAdmin === true) {
					const id = parseInt(req.params.loanId, 10);
					for (let x = 0; x < data.loans.length; x += 1) {
						if (data.loans[x].loanId === id) {
							return res.status(statusCode.STATUS_OK).send({
								status: statusCode.STATUS_OK,
								data: data.loans[x]
							});
						}
					}
				}
			}
		}

		res.status(statusCode.NOT_FOUND).send({
			status: statusCode.NOT_FOUND,
			error: 'Loan not found '
		});
		return true;
	}

	approveOrReject(req, res) {
		if (checkToken) {
			if (data.users.isAdmin === false) {
				res.status(statusCode.UNAUTHORIZED).send({
					status: statusCode.UNAUTHORIZED,
					error: 'You do not have enough user previledges'
				});
			}

			for (let x = 0; x < data.loans.length; x += 1) {
				const id = parseInt(req.params.loanId, 10);
				if (data.loans[x].loanId === id) {
					data.loans[x].status = req.body.status;

					return res.status(statusCode.STATUS_OK).send({
						status: statusCode.STATUS_OK,
						data: {
							loanId: data.loans[x].loanId,
							loanAmount: data.loans[x].loanAmount,
							tenor: data.loans[x].tenor,
							status: data.loans[x].status,
							monthlyInstallment: data.loans[x].paymentInstallment,
							interest: data.loans[x].interest
						}
					});
				}
			}
			res.status(statusCode.NOT_FOUND).send({
				status: statusCode.NOT_FOUND,
				error: 'Loan not found '
			});
		}
		return true;
	}

	createRepayment(req, res) {
		let authenticated;
		data.users.forEach((user) => {
			if (user.token === req.headers['access-token']) {
				authenticated = true;
			}
		});
		if (authenticated) {
			// eslint-disable-next-line consistent-return
			data.loans.forEach((ln) => {
				if (ln.loanId === parseInt(req.params.loanId, 10)) {
					const loan = {
						id: data.repayments.length + 1,
						loanId: ln.loanId,
						createdOn: currentDate(),
						amount: req.body.amount
					};
					// res.send({ message: req.headers['access-token'] });
					data.repayments.push(loan);
					return res.status(statusCode.STATUS_CREATED).send({
						status: statusCode.STATUS_CREATED,
						data: {
							id: loan.id,
							loanId: loan.loanId,
							createdOn: loan.createdOn,
							amount: ln.totalAmount,
							monthlyInstallment: ln.monthlyInstallment,
							paidAmount: loan.amount,
							balance: balance(ln.totalAmount, req.body.amount)
						}
					});
				}
			});
			res.status(statusCode.NOT_FOUND).send({
				status: statusCode.NOT_FOUND,
				error: 'Loan Not Found'
			});
		}
		return false;
	}
}

const loanController = new LoanController();
export default loanController;

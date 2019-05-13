/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
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

class LoanController {
	applyLoan(req, res) {
		for (let i = 0; i < data.users.length; i += 1) {
			const loan = {
				loanId: data.loans.length + 1,
				createdOn: currentDate(),
				user: data.users[i].email,
				amount: req.body.amount,
				tenor: req.body.tenor,
				paymentInstallment: paymentInstallment(req.body.amount, req.body.tenor),
				status: 'Pending',
				interest: 5 * (req.body.amount / 100),
				totalAmount: totalAmount(req.body.amount),
				amountPaid: 0,
				balance: balance(totalAmount(req.body.amount), 0),
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
					loanId: loan.loanId,
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
		return true;
	}

	getLoans(req, res) {
		if (Object.keys(req.query).length === 0) {
			res.status(statusCode.STATUS_OK).send({
				status: statusCode.STATUS_OK,
				data: data.loans
			});
		} else if (req.query.repaid === 'false') {
			const loans = data.loans.filter(
				loan => loan.status === req.query.status && loan.repaid === false
			);
			res.status(statusCode.STATUS_OK).send({
				status: statusCode.STATUS_OK,
				data: loans
			});
		} else if (req.query.repaid === 'true') {
			const loans = data.loans.filter(
				loan => loan.status === req.query.status && loan.repaid === true
			);
			res.status(statusCode.STATUS_OK).send({
				status: statusCode.STATUS_OK,
				data: loans
			});
		}
	}

	getLoan(req, res) {
		const id = parseInt(req.params.loanId, 10);
		for (let x = 0; x < data.loans.length; x += 1) {
			if (data.loans[x].loanId === id) {
				return res.status(statusCode.STATUS_OK).send({
					status: statusCode.STATUS_OK,
					data: data.loans[x]
				});
			}
		}
		res.status(statusCode.NOT_FOUND).send({
			status: statusCode.NOT_FOUND,
			error: 'Loan not found '
		});
		return true;
	}

	approveOrReject(req, res) {
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

	createRepayments(req, res) {
		data.loans.forEach((ln) => {
			if (ln.loanId === parseInt(req.params.loanId, 10)) {
				const loan = {
					id: data.repayments.length + 1,
					loanId: ln.loanId,
					createdOn: currentDate(),
					amount: req.body.amount
				};
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
						balance: balance(ln.balance, req.body.amount)
					}
				});
			}
		});
		res.status(statusCode.NOT_FOUND).send({
			status: statusCode.NOT_FOUND,
			error: 'Loan Not Found'
		});
	}

	getRepaymets(req, res) {
		const id = parseInt(req.params.loanId, 10);
		const monthlyPayment = data.loans.find((loan) => {
			if (loan.loanId === id) {
				return parseFloat(loan.paymentInstallment);
			}
		});

		data.repayments.forEach((loan) => {
			if (loan.loanId === id) {
				return res.status(statusCode.STATUS_OK).send({
					status: statusCode.STATUS_OK,
					data: {
						loanId: loan.loanId,
						createdOn: loan.createdOn,
						totalAmount: monthlyPayment.totalAmount,
						monthlyInstallment: monthlyPayment.paymentInstallment,
						amount: loan.amount
					}
				});
			}
			return true;
		});
		return res.status(statusCode.NOT_FOUND).send({
			status: statusCode.NOT_FOUND,
			error: 'Loan Not found'
		});
	}
}

const loanController = new LoanController();
export default loanController;

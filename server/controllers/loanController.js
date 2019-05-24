import jwt from 'jsonwebtoken';
import statusCode from '../helpers/statuses';
import helpers from '../helpers/helper';
import UserModel from '../models/userModel';
import LoanModel from '../models/loansModel';

class LoanController {
	static async applyLoan(req, res) {
		try {
			const {
				amount,
				tenor,
			} = req.body;
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const { email } = decoded;
			const getUserdeatails = await UserModel.getUserDetails(email);
			const date = helpers.currentDate();
			const rate = 5 * (amount / 100);
			const installment = helpers.paymentInstallment(amount, tenor);
			const {
				firstname,
				lastname,
				userid
			} = getUserdeatails;
			const reqLoan = await new LoanModel({
				userid,
				createdon: date,
				user: email,
				amount,
				tenor,
				paymentInstallment: installment,
				status: 'pending',
				balance: 0,
				interest: rate,
				repaid: false
			});

			if (!reqLoan.createLoan()) {
				res
					.status(statusCode.SERVER_ERROR)
					.send({ status: statusCode.SERVER_ERROR, error: 'Sorry we could not process your loan' });
			}
			const {
				createdon, user, paymentInstallment, status, interest, repaid
			} = reqLoan.payload;
			return res.status(statusCode.STATUS_CREATED).send({
				status: statusCode.STATUS_CREATED,
				data: {
					createdon,
					user,
					firstname,
					lastname,
					amount,
					tenor,
					paymentInstallment,
					interest,
					status,
					repaid,
				}
			});
		} catch (error) {
			return error;
		}
	}

	static async approveOrReject(req, res) {
		try {
			const { status } = req.body;
			const { loanId } = req.params;
			const approved = await LoanModel.approved(loanId, status);
			if (approved) {
				const {
					amount,
					tenor,
					paymentinstallment,
					interest
				} = approved;
				res.status(statusCode.STATUS_OK).send({
					status: statusCode.STATUS_OK,
					data: {
						loanId,
						loanAmount: amount,
						tenor,
						status,
						monthlyInstallment: paymentinstallment,
						interest

					}
				});
			} else {
				res.status(statusCode.NOT_FOUND).send({ status: statusCode.NOT_FOUND, error: 'Loan not found' });
			}
		} catch (error) {
			return error;
		}
	}

	static async getAllLoans(req, res) {
		try {
			if (!Object.keys(req.query).length) {
				const loans = await LoanModel.getAllLoans();
				if (!loans.length) {
					res.status(statusCode.NOT_FOUND).send({ status: statusCode.NOT_FOUND, error: 'Loans not found' });
				}
				res.status(statusCode.STATUS_OK).send({
					status: statusCode.STATUS_OK,
					data: loans
				});
			} else if (req.query.repaid === 'false') {
				const status = 'approved';
				const repaid = false;
				const loans = await LoanModel.getAllLoansString(status, repaid);
				if (!loans.length) {
					res.status(statusCode.NOT_FOUND).send({ status: statusCode.NOT_FOUND, error: 'Loans not found' });
				}
				res.status(statusCode.STATUS_OK).send({
					status: statusCode.STATUS_OK,
					data: loans
				});
			} else if (req.query.repaid === 'true') {
				const status = 'approved';
				const repaid = true;
				const loans = await LoanModel.getAllLoansString(status, repaid);
				if (!loans.length) {
					res.status(statusCode.NOT_FOUND).send({ status: statusCode.NOT_FOUND, error: 'Loans not found' });
				}
				res.status(statusCode.STATUS_OK).send({
					status: statusCode.STATUS_OK,
					data: loans
				});
			}
		} catch (err) {
			return err;
		}
	}

	static async getLoan(req, res) {
		try {
			const { loanId } = req.params;

			const loan = await LoanModel.getLoan(loanId);
			if (loan) {
				const {
					loanid,
					useremail,
					createdon,
					status,
					repaid,
					tenor,
					amount,
					paymentinstallment,
					balance,
					interest
				} = loan;

				res.status(statusCode.STATUS_OK).send({
					status: statusCode.STATUS_OK,
					data: {
						loanid,
						user: useremail,
						createdon,
						status,
						repaid,
						tenor,
						amount,
						paymentinstallment,
						balance,
						interest
					}
				});
			} else {
				res.status(statusCode.NOT_FOUND).send({ status: statusCode.NOT_FOUND, error: 'Loans not found' });
			}
		} catch (error) {
			console.log(error);
			return error;
		}
	}

	static async repayLoan(req, res) {
		try {
			const {
				amount
			} = req.body;
			const { loanId } = req.params;
			console.log(amount);
			const repayment = await LoanModel.repayLoan(loanId, amount);


			if (!repayment) {
				res.status(statusCode.NOT_FOUND).send({ status: statusCode.NOT_FOUND, error: 'Loan not found' });
			}
		} catch (error) {
			return error;
		}
	}
}
export default LoanController;

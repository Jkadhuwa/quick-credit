import jwt from 'jsonwebtoken';
import statusCode from '../helpers/statuses';
import helpers from '../helpers/helper';
import LoanModel from '../models/loansModel';
import UserModel from '../models/userModel';

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
			const reqLoan = await new LoanModel({
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
			const {
				firstname,
				lastname
			} = getUserdeatails;
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
					monthlyInstallment,
					interest
				} = approved;
				res.status(statusCode.STATUS_OK).send({
					status: statusCode.STATUS_OK,
					data: {
						loanId,
						loanAmount: amount,
						tenor,
						status,
						monthlyInstallment,
						interest

					}
				});
			} else {
				res.status(statusCode.UNAUTHORIZED).send({ status: statusCode.UNAUTHORIZED, error: 'Token error or You dont have previledges' });
			}
		} catch (error) {
			return error;
		}
	}
}


export default LoanController;

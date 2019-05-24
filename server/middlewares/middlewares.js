import jwt from 'jsonwebtoken';
import Data from '../db';
import statusCode from '../helpers/statuses';

class Verify {
	static async checkToken(req, res, next) {
		const reqToken = req.headers.authorization;
		try {
			if (!reqToken) {
				return res.status(statusCode.UNAUTHORIZED).send({
					status: statusCode.UNAUTHORIZED,
					error: 'Token Required'
				});
			}
			const token = reqToken.split(' ')[1];
			const verified = jwt.verify(token, process.env.JWT_SECRET);
			req.userinfo = verified;
			next();
		} catch (error) {
			return res.status(statusCode.UNAUTHORIZED).send({
				status: statusCode.UNAUTHORIZED,
				error: 'Invalid Token supplied'
			});
		}
	}

	static async checkAdmin(req, res, next) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const verified = jwt.verify(token, process.env.JWT_SECRET);

			if (verified.isAdmin === true) {
				next();
			} else {
				return res.status(statusCode.FORBIDDEN).send({
					status: statusCode.FORBIDDEN,
					error: 'You do not have enough priviledges to continue'
				});
			}
		} catch (err) {
			return err;
		}
	}


	static async loanVerifier(req, res, next) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const { email } = decoded;
			const sql = `SELECT users.status, loans.repaid FROM users FULL JOIN loans ON users.id = loans.userid WHERE  users.email = '${email}'`;
			const { rows } = await new Data().query(sql);

			if ((rows.length > 0) && (rows[0].status === 'unverified')) {
				res.status(statusCode.FORBIDDEN).send({ status: statusCode.FORBIDDEN, error: 'You can not apply for a loan at the moment. Please contact Admin' });
			} else if ((rows.length > 0) && (rows[0].repaid === false)) {
				return res.status(statusCode.CONFLICT).send({ status: statusCode.CONFLICT, error: 'You can not access another loan.' });
			}
			next();
		} catch (error) {
			return error;
		}
	}

	static async repaymentVerifier(req, res, next) {
		try {
			const { loanId } = req.params;

			const sql = `SELECT * FROM loans  WHERE  loanid= '${loanId}'`;
			const { rows } = await new Data().query(sql);
			console.log(rows);
			if (rows[0].status === 'approved') {
				next();
			} else if ((rows.length > 0) && (rows[0].repaid === false)) {
				return res.status(statusCode.FORBIDDEN).send({ status: statusCode.FORBIDDEN, error: 'You can not make repayment transaction. Loan is not approved .' });
			}
		} catch (error) {
			return error;
		}
	}
}
export default Verify;

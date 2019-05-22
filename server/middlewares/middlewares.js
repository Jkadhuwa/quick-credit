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
				return res.status(statusCode.UNAUTHORIZED).send({
					status: statusCode.UNAUTHORIZED,
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
			const sql = `SELECT * FROM loans WHERE useremail='${email}'`;
			const { rows } = await new Data().query(sql);
			if ((rows.length > 0) && (rows[0].repaid === false)) {
				return res.status(statusCode.CONFLICT).send({ status: statusCode.CONFLICT, error: 'You already have a loan' });
			}
			next();
		} catch (error) {
			return error;
		}
	}
}
export default Verify;


import jwt from 'jsonwebtoken';
import data from '../mock_db/database';
import statusCode from '../helpers/statuses';

const checkToken = (req, res, next) => {
	const reqToken = req.headers.authorization;

	if (!reqToken) {
		return res.status(statusCode.FORBIDDEN).send({
			status: statusCode.FORBIDDEN,
			error: 'Token Required'
		});
	}
	try {
		for (let i = 0; i < data.users.length; i += 1) {
			const verified = jwt.verify(reqToken, process.env.JWT_SECRET);
			if (data.users[i].id === verified.userId) {
				next();
			}
		}
	} catch (error) {
		return res.status(statusCode.UNAUTHORIZED).send({
			status: statusCode.UNAUTHORIZED,
			error: 'Invalid Token supplied'
		});
	}
};

const checkAdmin = (req, res, next) => {
	const reqToken = req.headers.authorization;
	if (checkToken) {
		const verified = jwt.verify(reqToken, process.env.JWT_SECRET);
		for (let i = 0; i < data.users.length; i += 1) {
			if (verified.isAdmin === true) {
				next();
			}
		}
		return res.status(statusCode.UNAUTHORIZED).send({
			status: statusCode.UNAUTHORIZED,
			error: 'You do not have enough priviledges to continue'
		});
	}
	return false;
};

export default { checkToken, checkAdmin };

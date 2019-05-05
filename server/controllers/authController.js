/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import data from '../mock_db/database';
import { createToken, unUsedEmail } from '../helpers/helper';
import { validate, validateLogin } from '../helpers/validator';
import statusCode from '../helpers/statuses';

class AuthController {
	createUser(req, res) {
		if (validate(req.body).length > 0) {
			return res
				.status(statusCode.BAD_REQUEST)
				.send({ status: statusCode.BAD_REQUEST, error: validate(req.body) });
		}
		if (unUsedEmail(req.body.email) > -1) {
			return res
				.status(statusCode.CONFLICT)
				.send({ status: statusCode.CONFLICT, error: 'Email already taken!!' });
		}

		const user = {
			token: createToken(),
			id: data.users.length + 1,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password,
			address: req.body.address,
			nationality: req.body.nationality,
			telephone: req.body.telephone,
			workAddress: req.body.workAddress,
			status: 'Unverified',
			isAdmin: false
		};

		const currentTotalUsers = parseInt(data.users.length, 10);
		let currentStatus = 0;
		data.users.push(user);
		if (data.users.length - currentTotalUsers === 1) {
			currentStatus = statusCode.STATUS_CREATED;
		}

		return res.status(currentStatus).send({
			status: currentStatus,
			data: {
				token: user.token,
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				telephone: user.telephone,
				nationality: user.nationality,
				workAddress: user.workAddress
			}
		});
	}

	// eslint-disable-next-line consistent-return
	loginUser(req, res) {
		if (validateLogin(req.body).length > 0) {
			return res.status(statusCode.BAD_REQUEST).send({
				status: statusCode.BAD_REQUEST,
				error: validateLogin(req.body)
			});
		}
		const userEmail = req.body.email;
		const userPassword = req.body.password;
		let userAuthenticated;

		data.users.forEach((user) => {
			if (user.email === userEmail) {
				if (user.password === userPassword) {
					userAuthenticated = true;
					return res.status(statusCode.STATUS_OK).send({
						status: statusCode.STATUS_OK,
						data: {
							token: createToken(),
							id: user.id,
							firstName: user.firstName,
							lastName: user.lastName,
							email: user.email,
							nationality: user.nationality,
							telephone: user.telephone,
							address: user.address,
							workAddress: user.workAddress
						}
					});
				}
			}
		});
		if (!userAuthenticated) {
			return res.status(statusCode.NOT_FOUND).send({
				status: statusCode.NOT_FOUND,
				error: 'User not found or Wrong password'
			});
		}
	}
}

const authController = new AuthController();
export default authController;

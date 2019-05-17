import data from '../mock_db/database';
import statusCode from '../helpers/statuses';
import generateToken from '../helpers/auth';

class UsersController {
// Create Users
	createUser(req, res) {
		const userId = data.users.length + 1;
		const user = {
			token: generateToken(userId, false, req.body.email),
			id: userId,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password,
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
				workAddress: user.workAddress,
				isAdmin: user.isAdmin
			}
		});
	}
	// Login function

	loginUser(req, res) {
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
							token: generateToken(user.id, user.isAdmin, user.email),
							id: user.id,
							firstName: user.firstName,
							lastName: user.lastName,
							email: user.email,
							nationality: user.nationality,
							telephone: user.telephone,
							address: user.address,
							workAddress: user.workAddress,
							isAdmin: user.isAdmin
						}
					});
				}
			}
		});
		if (!userAuthenticated) {
			return res.status(statusCode.UNAUTHORIZED).send({
				status: statusCode.UNAUTHORIZED,
				error: 'Wrong Email Address or  password'
			});
		}
	}

	// Admin Mark user as verified
	markVerified(req, res) {
		for (let x = 0; x < data.users.length; x += 1) {
			const email = req.params.userEmail;
			if (data.users[x].email === email) {
				data.users[x].status = 'verified';

				return res.status(statusCode.STATUS_OK).send({
					status: statusCode.STATUS_OK,
					data: {
						id: data.users[x].id,
						email: data.users[x].email,
						firstName: data.users[x].firstName,
						lastName: data.users[x].lastName,
						password: data.users[x].password,
						address: data.users[x].address,
						status: data.users[x].status,
						isAdmin: data.users[x].isAdmin
					}
				});
			}
		}
		res.status(statusCode.NOT_FOUND).send({
			status: statusCode.NOT_FOUND,
			error: 'User not found '
		});
	}

	// Admin get all users
	getAllUsers(req, res) {
		res.status(statusCode.STATUS_OK).send({
			status: statusCode.STATUS_OK,
			data: data.users
		});
	}
}

const usersController = new UsersController();
export default usersController;

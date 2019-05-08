/* eslint-disable consistent-return */

/* eslint-disable class-methods-use-this */
import data from '../mock_db/database';
import statusCode from '../helpers/statuses';
import checkToken from '../middlewares/middlewares';

class UsersController {
	markVerified(req, res) {
		for (let i = 0; i < data.users.length; i += 1) {
			if (checkToken) {
				if (data.users[i].isAdmin === true) {
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
			}
		}
	}

	getAllUsers(req, res) {
		for (let i = 0; i < data.users.length; i += 1) {
			if (data.users[i].token === req.headers['access-token']) {
				if (data.users[i].isAdmin === true) {
					res.status(statusCode.STATUS_OK).send({
						status: statusCode.STATUS_OK,
						data: data.users
					});
				} else {
					res.status(statusCode.UNAUTHORIZED).send({
						status: statusCode.UNAUTHORIZED,
						error: 'Users does not have enough previledges'
					});
				}
			}
		}
	}
}

const usersController = new UsersController();
export default usersController;

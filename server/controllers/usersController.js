import statusCode from '../helpers/statuses';
import Auth from '../helpers/auth';
import UserModel from '../models/userModel';

class UsersController {
	static async createUser(req, res) {
		try {
			const {
				firstname,
				lastname,
				email,
				password,
				nationality,
				telephone,
				workaddress,
				isadmin
			} = req.body;
			const userPassword = Auth.hashPassword(password);
			const regUser = await new UserModel({
				firstname,
				lastname,
				email,
				password: userPassword,
				nationality,
				telephone,
				workaddress,
				status: 'unverified',
				isadmin
			});
			if (!regUser.createUser()) {
				res
					.status(statusCode.CONFLICT)
					.send({ status: statusCode.CONFLICT, error: 'Email already in use' });
			}
			const token = Auth.generateToken(regUser.isadmin, regUser.email);
			return res.status(statusCode.STATUS_CREATED).send({
				status: statusCode.STATUS_CREATED,
				data: {
					token,
					firstname: regUser.firstname,
					lastname: regUser.lastname,
					email: regUser.email,
					telephone: regUser.telephone,
					workaddress: regUser.workaddress,
					status: regUser.status,
					isadmin: regUser.isadmin
				}
			});
		} catch (error) {
			return error;
		}
	}

	static async login(req, res) {
		try {
			const { email, password } = req.body;
			const userLogin = await UserModel.login(email);
			if (userLogin) {
				if (Auth.comparePassword(password, userLogin.password)) {
					const token = Auth.generateToken(userLogin.isadmin, userLogin.email);
					const {
						firstname,
						lastname,
						telephone,
						workaddress,
						status,
						isadmin
					} = userLogin;
					return res.status(statusCode.STATUS_OK).send({
						status: statusCode.STATUS_OK,
						data: {
							token,
							firstname,
							lastname,
							email,
							telephone,
							workaddress,
							status,
							isadmin

						}
					});
				}
				return res.status(statusCode.UNAUTHORIZED).send({ status: statusCode.UNAUTHORIZED, error: 'Wrong password or email' });
			}
			return res.status(statusCode.NOT_FOUND).send({ status: statusCode.NOT_FOUND, error: 'User not found' });
		} catch (error) {
			return error;
		}
	}

	static async getAllUsers(req, res) {
		try {
			const users = await UserModel.getUsers();
			if (!users) {
				res.status(statusCode.NOT_FOUND).send({ status: statusCode.NOT_FOUND, error: 'Users not found' });
			}
			res.status(statusCode.STATUS_OK).send({
				status: statusCode.STATUS_OK,
				data: users
			});
		} catch (err) {
			return err;
		}
	}

	static async getUser(req, res) {
		try {
			const email = req.params.userEmail;

			const user = await UserModel.getUser(email);

			if (user) {
				const {
					firstname,
					lastname,
					telephone,
					workaddress,
					isadmin
				} = user;
				res.status(statusCode.STATUS_OK).send({
					status: statusCode.STATUS_OK,
					data: {
						firstname,
						lastname,
						email,
						telephone,
						workaddress,
						userstatus: user.status,
						isadmin
					}
				});
			}
		} catch (error) {
			return error;
		}
	}

	static async markVerified(req, res) {
		try {
			const status = 'verified';
			const email = req.params.userEmail;
			const verifyUser = await UserModel.markVerified(email, status);
			if (verifyUser) {
				const {
					firstname,
					lastname,
					telephone,
					workaddress,
					isadmin
				} = verifyUser;
				res.status(statusCode.STATUS_OK).send({
					status: statusCode.STATUS_OK,
					data: {
						firstname,
						lastname,
						email,
						telephone,
						workaddress,
						userstatus: verifyUser.status,
						isadmin

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
export default UsersController;

import statusCode from '../helpers/statuses';
import Auth from '../helpers/auth';
import UserModel from '../models/userModel';

class UsersController {
	static async createUser(req, res) {
		try {
			const {
				firstName,
				lastName,
				email,
				password,
				nationality,
				telephone,
				workAddress,
				isAdmin
			} = req.body;
			const userPassword = Auth.hashPassword(password);
			const regUser = await new UserModel({
				firstName,
				lastName,
				email,
				password: userPassword,
				nationality,
				telephone,
				workAddress,
				status: 'unverified',
				isAdmin
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
					firstName: regUser.firstname,
					lastName: regUser.lastname,
					email: regUser.email,
					telephone: regUser.telephone,
					workAddress: regUser.workaddress,
					status: regUser.status,
					isAdmin: regUser.isadmin
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
			const {
				firstName,
				lastName,
				nationality,
				telephone,
				workAddress,
				isAdmin
			} = userLogin;
			if (userLogin) {
				if (Auth.comparePassword(password, userLogin.password)) {
					const token = Auth.generateToken(userLogin.isadmin, userLogin.email);
					const { firstname,
						lastname,
						email,
						telephone,
						workaddress,
						status,
						isadmin
					} = userLogin
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

			return error;
		}
	}
}
export default UsersController;

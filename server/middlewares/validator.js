import statusCodes from '../helpers/statuses';
import data from '../mock_db/database';
import Db from '../db';


class Validations {
	static validateSignup(req, res, next) {
		let regex;
		const {
			firstName,
			lastName,
			email,
			password,
			telephone,
			nationality,
			workAddress
		} = req.body;

		if (
			!firstName
      || !lastName
      || !email
      || !password
      || !telephone
      || !nationality
      || !workAddress
		) {
			res.status(statusCodes.BAD_REQUEST).send({
				status: statusCodes.BAD_REQUEST,
				error: 'Please ensure all fields are filled'
			});
		}

		if (firstName) {
			regex = /^[A-Za-z]+$/;
			if (!regex.test(firstName)) {
				res.status(statusCodes.BAD_REQUEST).send({
					status: statusCodes.BAD_REQUEST,
					error: 'Enter a valid First Name'
				});
			}
		}
		if (lastName) {
			regex = /^[A-Za-z]+$/;
			if (!regex.test(lastName)) {
				res.status(statusCodes.BAD_REQUEST).send({
					status: statusCodes.BAD_REQUEST,
					error: 'Enter a valid Last Name'
				});
			}
		}

		if (email) {
			regex = /\S+@\S+\.\S+/;
			if (!regex.test(email)) {
				res.status(statusCodes.BAD_REQUEST).send({
					status: statusCodes.BAD_REQUEST,
					error: 'Enter a valid Email Address'
				});
			} else {
				data.users.forEach((user) => {
					if (email === user.email) {
						res.status(statusCodes.CONFLICT).send({
							status: statusCodes.CONFLICT,
							error: 'Email already taken'
						});
					}
				});
			}
		}

		if (password) {
			regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}/;
			if (!regex.test(password)) {
				res.status(statusCodes.BAD_REQUEST).send({
					status: statusCodes.BAD_REQUEST,
					error:
            'Password should include atleast one uppercase, lowercase letters, a number and should have more than 6 characters.'
				});
			}
		}
		if (telephone) {
			regex = /^07(?:(?:[129][0-9])|(?:0[0-8])|(4[0-1]))[0-9]{6}$/;

			if (!regex.test(telephone)) {
				res.status(statusCodes.BAD_REQUEST).send({
					status: statusCodes.BAD_REQUEST,
					error: 'Enter a valid Phone number'
				});
			}
		}
		if (nationality) {
			regex = /^[A-Za-z]+$/;
			if (!regex.test(nationality)) {
				res.status(statusCodes.BAD_REQUEST).send({
					status: statusCodes.BAD_REQUEST,
					error: 'Enter a Valid Country name'
				});
			}
		}
		if (workAddress) {
			regex = /^[#.0-9a-zA-Z\s,-]+$/;
			if (!regex.test(workAddress)) {
				res.status(statusCodes.BAD_REQUEST).send({
					status: statusCodes.BAD_REQUEST,
					error: 'Enter a Valid work address'
				});
			}
		}
		next();
	}

	static async validatenewEmail(req, res, next) {
		try {
			const { email } = req.body;
			const sql = `SELECT * FROM users WHERE email='${email}'`;
			const { rows } = await new Db().query(sql);
			if (rows.length > 0) {
				return res.status(statusCodes.CONFLICT).send({ status: statusCodes.CONFLICT, error: 'Email already in use' });
			}
			next();
		} catch (error) {
			res
				.status(statusCodes.SERVER_ERROR)
				.send({
					status: statusCodes.SERVER_ERROR,
					error: 'Internal server error'
				});
		}
	}

	static validateLogin(req, res, next) {
		let regex;
		const { email, password } = req.body;
		if (!email || !password) {
			res.status(statusCodes.BAD_REQUEST).send({
				status: statusCodes.BAD_REQUEST,
				error: 'Please ensure all fields are filled'
			});
		}

		if (email) {
			regex = /\S+@\S+\.\S+/;
			if (!regex.test(email)) {
				res.status(statusCodes.BAD_REQUEST).send({
					status: statusCodes.BAD_REQUEST,
					error: 'Enter a valid Email Address'
				});
			}
		}
		if (password) {
			if (password.length < 6) {
				res.status(statusCodes.BAD_REQUEST).send({
					status: statusCodes.BAD_REQUEST,
					error:
            'Password should include atleast one uppercase, lowercase letters, a number and should have more than 6 characters.'
				});
			}
		}
		next();
	}

	static validateApplication(req, res, next) {
		let regex;
		const { amount, tenor } = req.body;
		if (!amount || !tenor) {
			res.status(statusCodes.BAD_REQUEST).send({
				status: statusCodes.BAD_REQUEST,
				error: 'Please ensure all fields are filled'
			});
		}
		if (amount) {
			regex = /([0-9]*[.])?[0-9]+/;
			if (!regex.test(amount)) {
				res.status(statusCodes.BAD_REQUEST).send({
					status: statusCodes.BAD_REQUEST,
					error: 'Amount only takes Floating or Numeric values'
				});
			}
		}
		if (tenor) {
			regex = /^([1-9]|1[012])$/;
			if (!regex.test(tenor)) {
				res.status(statusCodes.BAD_REQUEST).send({
					status: statusCodes.BAD_REQUEST,
					error: 'Takes numbers between 1 - 12'
				});
			}
		}
		next();
	}

	static validateRepayment(req, res, next) {
		let regex;
		const { amount } = req.body;
		if (!amount) {
			res.status(statusCodes.BAD_REQUEST).send({
				status: statusCodes.BAD_REQUEST,
				error: 'Amount is required'
			});
		}
		if (amount) {
			regex = /\d+\.?\d+/;
			if (!regex.test(amount)) {
				res.status(statusCodes.BAD_REQUEST).send({
					status: statusCodes.BAD_REQUEST,
					error: 'Amount only takes Floating or Numeric values'
				});
			}
		}
		next();
	}
}
export default Validations;

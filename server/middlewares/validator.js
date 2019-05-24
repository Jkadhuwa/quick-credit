import statusCodes from '../helpers/statuses';
import Db from '../db';


class Validations {
	static validateSignup(req, res, next) {
		try {
			let regex;
			const {
				firstname,
				lastname,
				email,
				password,
				telephone,
				nationality,
				workaddress,
				isadmin
			} = req.body;
			if (!firstname
				|| !lastname
				|| !email
				|| !password
				|| !telephone
				|| !nationality
				|| !workaddress
				|| !isadmin
			) {
				res.status(statusCodes.BAD_REQUEST).send({
					status: statusCodes.BAD_REQUEST,
					error: 'Please ensure all fields are filled'
				});
			}

			if (firstname) {
				regex = /^[A-Za-z]+$/;
				if (!regex.test(firstname)) {
					res.status(statusCodes.BAD_REQUEST).send({
						status: statusCodes.BAD_REQUEST,
						error: 'Enter a valid First Name'
					});
				}
			}
			if (lastname) {
				regex = /^[A-Za-z]+$/;
				if (!regex.test(lastname)) {
					res.status(statusCodes.BAD_REQUEST).send({
						status: statusCodes.BAD_REQUEST,
						error: 'Enter a valid Last Name'
					});
				}
			}

			if (email) {
				regex = /(^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+\.[a-z]+$)/;
				if (!regex.test(email)) {
					res.status(statusCodes.BAD_REQUEST).send({
						status: statusCodes.BAD_REQUEST,
						error: 'Enter a valid Email Address'
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
				if (workaddress) {
					regex = /^[#.0-9a-zA-Z\s,-]+$/;
					if (!regex.test(workaddress)) {
						res.status(statusCodes.BAD_REQUEST).send({
							status: statusCodes.BAD_REQUEST,
							error: 'Enter a Valid work address'
						});
					}
				}
				if (isadmin) {
					if ((isadmin === true) || (isadmin === false)) {
						next();
					} else {
						res.status(statusCodes.BAD_REQUEST).send({ status: statusCodes.BAD_REQUEST, error: 'Please enter a valid isadmin value' });
					}
				}
			}
			next();
		} catch (error) {
			return error;
		}
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
			return error;
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
			regex = /(^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+\.[a-z]+$)/;
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
			regex = /([1-9]|1[012])$/;
			if ((!regex.test(tenor)) || (tenor === 0)) {
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

	static validateEmail(req, res, next) {
		const { userEmail } = req.params;
		const regex = /(^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+\.[a-z]+$)/;
		if (!regex.test(userEmail)) {
			res.status(statusCodes.BAD_REQUEST).send({
				status: statusCodes.BAD_REQUEST,
				error: 'Enter a valid Email Address'
			});
		}
		next();
	}

	static validateId(req, res, next) {
		const { loanId } = req.params;
		const regex = /([0-9])$/;
		if (!regex.test(loanId)) {
			res.status(statusCodes.BAD_REQUEST).send({
				status: statusCodes.BAD_REQUEST,
				error: 'LoanId takes numerical values only'
			});
		}
		next();
	}

	static verifyloanStatus(req, res, next) {
		const { status } = req.body;
		if ((status === 'approved') || (status === 'rejected')) {
			next();
		} else {
			res.status(statusCodes.BAD_REQUEST).send({ status: statusCodes.BAD_REQUEST, error: 'Please enter a valid status string' });
		}
	}
}
export default Validations;

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


class Auth {
	static hashPassword(password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
	}

	static comparePassword(password, hashedPassword) {
		return bcrypt.compareSync(password, hashedPassword);
	}

	static generateToken(isAdmin, email, firstname, lastname) {
		const token = jwt.sign(
			{
				isAdmin,
				email,
				firstname,
				lastname
			},
			process.env.JWT_SECRET,
			{ expiresIn: '1d' }
		);
		return token;
	}
}
export default Auth;

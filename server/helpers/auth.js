import jwt from 'jsonwebtoken';

const generateToken = (userId, isAdmin, email) => {
	const token = jwt.sign(
		{
			userId,
			isAdmin,
			email
		},
		process.env.JWT_SECRET,
		{ expiresIn: '1d' }
	);
	return token;
};

export default generateToken;

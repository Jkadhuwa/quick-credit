import jwt from 'jsonwebtoken';

const generateToken = (userId, isAdmin) => {
	const token = jwt.sign({
		userId,
		isAdmin
	},
	process.env.JWT_SECRET, { expiresIn: '1d' });
	return token;
};

export default generateToken;

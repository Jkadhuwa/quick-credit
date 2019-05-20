import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV; // 'dev' or 'test'

const dev = {
	db: process.env.DATABASE_URL,
};

const test = {
	db: process.env.DATABASE_TEST_URL,
};

const config = {
	dev,
	test,
};

export default config[env];

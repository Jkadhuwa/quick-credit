import { Pool } from 'pg';
import config from '../config/config';

require('dotenv').config();

const dbConfig = {
	connectionString: config.db
};

class DatabaseInit {
	constructor() {
		try {
			this.pool = new Pool(dbConfig);
			this.connect = async () =>
				this.pool.on('connect', (err) => {
				});

			this.queryUsers = `CREATE TABLE IF NOT EXISTS users(
			  id serial PRIMARY KEY,
			  firstName VARCHAR(128) NOT NULL,
			  lastName VARCHAR(128) NOT NULL,
			  email VARCHAR(128) NOT NULL,
			  password VARCHAR(128) NOT NULL,
		  	  telephone VARCHAR(128) NOT NULL,
			  workAddress VARCHAR(128) NOT NULL,
			  nationality VARCHAR(128) NOT NULL,
			  status VARCHAR(128) NOT NULL,
			  isAdmin BOOLEAN NOT NULL
			)`;
			this.queryLoans = `CREATE TABLE IF NOT EXISTS loans(
			  loanid serial PRIMARY KEY,
			  userid INT NOT NULL REFERENCES users(id),
			  createdOn VARCHAR(128) NOT NULL,
			  useremail VARCHAR(128) NOT NULL,
		  	  amount NUMERIC NOT NULL,
			  tenor INT NOT NULL,
			  totalAmount NUMERIC NOT NULL,
			  paymentInstallment NUMERIC NOT NULL,
			  status VARCHAR(128) NOT NULL,
			  interest NUMERIC  NOT NULL,
			  balance NUMERIC NOT NULL,
			  repaid BOOLEAN NOT NULL
			)`;
			this.queryRepayments = `CREATE TABLE IF NOT EXISTS repayments(
			  id serial PRIMARY KEY,
			  loan_id INT NOT NULL REFERENCES loans(loanid),
			  createdOn VARCHAR(128) NOT NULL,
		  	  amount NUMERIC NOT NULL
			)`;
			this.initDb();
		} catch (err) {
			return err;
		}
	}

	async query(sql, data = []) {
		const conn = await this.connect();
		try {
			if (data.length) {
				return await conn.query(sql, data);
			}
			return await conn.query(sql);
		} catch (err) {
			return err;
		}
	}

	async initDb() {
		try {
			await this.query(this.queryUsers);
			await this.query(this.queryLoans);
			await this.query(this.queryRepayments);
		} catch (error) {
			return error;
		}
	}
}

export default DatabaseInit;

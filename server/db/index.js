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
			  id serial,
			  firstName VARCHAR(128) NOT NULL,
			  lastName VARCHAR(128) NOT NULL,
			  email VARCHAR(128) NOT NULL  PRIMARY KEY,
			  password VARCHAR(128) NOT NULL,
		  	  telephone VARCHAR(128) NOT NULL,
			  workAddress VARCHAR(128) NOT NULL,
			  nationality VARCHAR(128) NOT NULL,
			  status VARCHAR(128) NOT NULL,
			  isAdmin BOOLEAN NOT NULL
			)`;
			this.queryLoans = `CREATE TABLE IF NOT EXISTS loans(
			  loanid serial PRIMARY KEY,
			  createdOn VARCHAR(128) NOT NULL,
			  useremail VARCHAR(128) NOT NULL,
		  	  amount INT NOT NULL,
			  tenor INT NOT NULL,
			  paymentInstallment INT NOT NULL,
			  status VARCHAR(128) NOT NULL,
			  interest INT  NOT NULL,
			  balance INT NOT NULL,
			  repaid BOOLEAN NOT NULL
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
		} catch (error) {
			return error;
		}
	}
}

export default DatabaseInit;

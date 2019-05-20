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
					console.log(`connected to ${dbConfig.connectionString}`);
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
			  isAdmin VARCHAR(100)  NOT NULL
			)`;
			this.initDb();
		} catch (err) {
			// console.log(err);
			return err;
		}
	}

	async query(sql, data = []) {
		console.log('here');

		const conn = await this.connect();
		try {
			if (data.length) {
				console.log('niko');
				return await conn.query(sql, data);
			}
			console.log('niko apa');
			return await conn.query(sql);
		} catch (err) {
			return err;
		}
	}

	async initDb() {
		try {
			await this.query(this.queryUsers);
			console.log('table created');
		} catch (error) {
			return error;
		}
	}
}

export default DatabaseInit;

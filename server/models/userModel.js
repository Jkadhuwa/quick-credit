import Data from '../db';

class UsersModel {
	constructor(payload = null) {
		this.payload = payload;
		this.result = null;
	}

	async createUser() {
		try {
			const {
				firstname, lastname, email, password, telephone, workaddress, nationality, status, isadmin
			} = this.payload;
			const values = [
				firstname,
				lastname,
				email,
				password,
				telephone,
				workaddress,
				nationality,
				status,
				isadmin
			];

			const sql = 'INSERT INTO users (firstname, lastname, email, password, telephone, workaddress, nationality, status, isadmin) VALUES($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9) returning *;';
			const rows = await new Data().query(sql, values);
			this.result = rows;
			return true;
		} catch (error) {
			return error;
		}
	}

	static async login(email) {
		try {
			const sql = `SELECT * FROM users WHERE email='${email}';`;
			const { rows } = await new Data().query(sql);
			if (!rows.length) {
				return false;
			}
			this.result = rows[0];
			return this.result;
		} catch (error) {
			return error;
		}
	}

	static async getUsers() {
		try {
			const sql = 'SELECT * FROM users;';
			const { rows } = await new Data().query(sql);
			if (rows) {
				this.result = rows;
				return this.result;
			}
			return false;
		} catch (error) {
			return error;
		}
	}

	static async getUser(email) {
		try {
			const sql = `SELECT * FROM users WHERE email='${email}';`;
			const { row } = await new Data().query(sql);
			if (row) {
				this.result = row;
				return this.result;
			}
			return false;
		} catch (error) {
			return error;
		}
	}

	static async markVerified(email, status) {
		try {
			const sql = 'UPDATE users SET status = ($1) WHERE email = $2 returning *;';
			const values = [status, email];
			const { rows } = await new Data().query(sql, values);
			if (!rows.length) {
				return false;
			}
			this.result = rows[0];
			return this.result;
		} catch (error) {
			return error;
		}
	}
}
export default UsersModel;

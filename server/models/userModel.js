import Data from '../db/db';

class UsersModel {
	constructor(payload = null) {
		this.payload = payload;
		this.result = null;
	}

	async createUser() {
		const user = {
			firstname: this.payload.firstName,
			lastname: this.payload.lastName,
			email: this.payload.email,
			password: this.payload.password,
			telephone: this.payload.telephone,
			workAddress: this.payload.workAddress,
			nationality: this.payload.nationality,
			status: this.payload.status,
			isAdmin: this.payload.isAdmin
		};
		const values = [
			user.firstname,
			user.lastname,
			user.email,
			user.password,
			user.telephone,
			user.workAddress,
			user.nationality,
			user.status,
			user.isAdmin
		];
		const sql = 'INSERT INTO users (firstname, lastname, email, password, telephone, workAddress, nationality, status, isAdmin) VALUES($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9) returning *;';
		const { rows } = await new Data().query(sql, values);
		this.result = rows;
		return true;
	}

	static async login(email) {
		const sql = `SELECT * FROM users WHERE email='${email}';`;
		const { rows } = await new Data().query(sql);
		if (rows.length === 0) {
			return false;
		}
		this.result = rows[0];
		return this.result;
	}

	static async getUsers() {
		const sql = 'SELECT * FROM users;';
		const { rows } = await new Data().query(sql);
		if (rows) {
			this.result = rows;
			return this.result;
		}
		return false;
	}

	static async getUser(email) {
		const sql = `SELECT * FROM users WHERE email='${email}';`;
		const { row } = await new Data().query(sql);
		console.log(row);
		if (row) {
			this.result = row;
			return this.result;
		}
		return false;
	}

	static async markVerified(email, status) {
		const sql = 'UPDATE users SET status = ($1) WHERE email = $2 returning *;';
		const values = [status, email];
		const { rows } = await new Data().query(sql, values);
		if (rows.length === 0) {
			return false;
		}
		this.result = rows[0];
		return this.result;
	}
}

export default UsersModel;

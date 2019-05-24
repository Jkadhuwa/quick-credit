import Data from '../db';

class LoansModel {
	constructor(payload = null) {
		this.payload = payload;
		this.result = null;
	}

	async createLoan() {
		try {
			const {
				userid, createdon, user, amount, tenor,
				paymentInstallment, status, interest, balance, repaid
			} = this.payload;

			const values = [
				userid,
				createdon,
				user,
				amount,
				tenor,
				paymentInstallment,
				status,
				interest,
				balance,
				repaid,
			];
			console.log(this.payload);

			const sql = 'INSERT INTO loans (userid, createdOn, useremail, amount, tenor,  paymentInstallment, status, interest, balance, repaid) VALUES($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9, $10) returning *;';
			const { rows } = await new Data().query(sql, values);
			this.result = rows;
			return true;
		} catch (error) {
			return error;
		}
	}

	static async approved(loanId, status) {
		try {
			const sql = 'UPDATE loans SET status = ($1) WHERE loanid = $2 returning *;';
			const values = [status, loanId];
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

	static async getAllLoans() {
		try {
			const sql = 'SELECT * FROM loans;';
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


	static async getAllLoansString(status, repaid) {
		try {
			const sql = 'SELECT * FROM loans WHERE status = $1;';
			const values = [status, repaid];
			const { rows } = await new Data().query(sql, values);
			console.log(rows);
			if (rows) {
				this.result = rows;
				return this.result;
			}
			return false;
		} catch (error) {
			return error;
		}
	}

	static async getLoan(loanId) {
		try {
			const sql = `SELECT * FROM loans WHERE loanid = '${loanId}';`;
			const row = await new Data().query(sql);
			if (row) {
				this.result = row.rows[0];
				return this.result;
			}
			return false;
		} catch (error) {
			return error;
		}
	}

	static async repayLoan(loanId, amount) {
		try {
			console.log(loanId);

			const sql = `SELECT * FROM loans WHERE loanid = '${loanId}';`;
			const { rows } = await new Data().query(sql);
			let { balance } = rows[0];
			const { totalamount } = rows;
			balance = parseFloat(totalamount) - parseFloat(amount);
			const sqlRepay = `UPDATE loans SET balance = ($1) WHERE loanid = $2 returning *;'`;
			const values = [balance, loanId];
			const row = await new Data().query(sqlRepay, values);
		} catch (error) {
			return error;
		}
	}
}


export default LoansModel;

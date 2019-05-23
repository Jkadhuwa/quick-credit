import Data from '../db';

class LoansModel {
	constructor(payload = null) {
		this.payload = payload;
		this.result = null;
	}

	async createLoan() {
		try {
			const {
				createdon, user, amount, tenor,
				paymentInstallment, status, interest, balance, repaid
			} = this.payload;

			const values = [
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

			const sql = 'INSERT INTO loans (createdOn, useremail, amount, tenor,  paymentInstallment, status, interest, balance, repaid) VALUES($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9) returning *;';
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
}


export default LoansModel;

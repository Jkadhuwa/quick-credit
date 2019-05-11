/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */
import data from '../mock_db/database';

const isValidEmail = (email) => {
	return /\S+@\S+\.\S+/.test(email);
};

const isValidTelephone = (telephone) => {
	return /^07(?:(?:[129][0-9])|(?:0[0-8])|(4[0-1]))[0-9]{6}$/.test(telephone);
};

const usedEmail = (email) => {
	let userFound = false;
	data.users.map((user) => {
		if (user.email === email) {
			userFound = true;
		}
		return userFound;
	});
};

const paymentInstallment = (amount, tenor) => {
	const interest = 5 * (amount / 100);
	return (parseFloat(amount) + parseFloat(interest)) / +tenor;
};

const totalAmount = (amount) => {
	const interest = 5 * (amount / 100);
	return parseFloat(amount) + parseFloat(interest);
};

const currentDate = () => {
	const today = new Date();
	const date = `${today.getFullYear()}-${today.getMonth() +
    1}-${today.getDate()}`;
	const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
	const dateTime = `${date} ${time}`;
	return dateTime;
};
const balance = (loan, paidAmount) => {
	let blnc;
	if (parseFloat(loan) >= parseFloat(paidAmount)) {
		blnc = parseFloat(loan) - parseFloat(paidAmount);
	} else {
		blnc = 0;
	}
	return blnc;
};
module.exports = {
	isValidEmail,
	isValidTelephone,
	usedEmail,
	paymentInstallment,
	currentDate,
	totalAmount,
	balance
};

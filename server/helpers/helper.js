/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */
import data from '../mock_db/database';

const createToken = () => {
	let token = '';
	const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < 20; i += 1) {
		token += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return token;
};
const isValidEmail = (email) => {
	return /\S+@\S+\.\S+/.test(email);
};

const isValidTelephone = (telephone) => {
	return /^07(?:(?:[129][0-9])|(?:0[0-8])|(4[0-1]))[0-9]{6}$/.test(telephone);
};

const unUsedEmail = (email) => {
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
	const blnc = parseFloat(loan) - parseFloat(paidAmount);
	return blnc;
};
module.exports = {
	createToken,
	isValidEmail,
	isValidTelephone,
	unUsedEmail,
	paymentInstallment,
	currentDate,
	totalAmount,
	balance
};

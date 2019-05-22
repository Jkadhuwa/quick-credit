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
	const date = `${today.getFullYear()}-${today.getMonth()
    + 1}-${today.getDate()}`;
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

export default {
	paymentInstallment,
	currentDate,
	totalAmount,
	balance
};

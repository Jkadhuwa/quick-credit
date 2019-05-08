module.exports = {
	users: [
		{
			token: 'SBgpaZdIDdWlHUexc45m',
			id: 1,
			email: 'jaymusinda@live.com',
			firstName: 'Musinda',
			lastName: 'Kadhuwa',
			password: 'Kadhush',
			address: 'Clay works appt 4, Seasons st Kasarani',
			nationality: 'Kenyan',
			telephone: '+254713723191',
			workAddress: 'bruce hse Nrb',
			status: 'verified',
			isAdmin: true
		},
		{
			token: 'SBgpaZdIDdWlHUexc46m',
			id: 2,
			email: 'joankadzo@gmail.com',
			firstName: 'Joan',
			lastName: 'Kadzo',
			password: 'Joankadzo',
			address: 'Majengo plt No 415, Malindi',
			nationality: 'Rwandan',
			telephone: '+250713723367',
			workAddress: 'KIST hse kgl',
			status: 'verified',
			isAdmin: true
		},
		{
			token: 'SBgpaZdIDdWlHUexc4m',
			id: 3,
			email: 'sam3ziro@gmail.com',
			firstName: 'Samuel',
			lastName: 'Ziro',
			password: 'Kadhush',
			address: 'GSU Barracks, Embakasi',
			nationality: 'Kenyan',
			telephone: '+254713723151',
			workAddress: 'Embakasi gsu Hqs',
			status: 'unverified',
			isAdmin: false
		},
		{
			id: 4,
			email: 'kja2aro@gmail.com',
			firstName: 'James',
			lastName: 'Saro',
			password: 'kalume!',
			address: 'Clay works appt 6, Seasons st Kasarani',
			nationality: 'Kenyan',
			telephone: '+254713723191',
			workAddress: 'bruce hse Nrb',
			status: 'verified',
			isAdmin: false
		}
	],
	loans: [
		{
			loanId: 1,
			user: 'sam3ziro@gmail.com',
			createdOn: '12-10-2019',
			status: 'Pending',
			repaid: false,
			tenor: 10,
			amount: 50000,
			totalAmount: 52500,
			balance: 52500,
			paymentInstallment: 5250,
			interest: 2500
		},
		{
			loanId: 2,
			user: 'joankadzo@gmail.com',
			createdOn: '12-10-2019',
			status: 'approved',
			repaid: false,
			tenor: 10,
			amount: 10000,
			totalAmount: 10500,
			balance: 5000,
			paymentInstallment: 1050,
			interest: 500
		},
		{
			loanId: 3,
			user: 'kja2aro@gmail.com',
			createdOn: '12-10-2019',
			status: 'rejected',
			repaid: false,
			tenor: 10,
			totalAmount: 10500,
			amount: 10000,
			balance: 0,
			paymentInstallment: 1050,
			interest: 500
		}
	],
	repayments: [
		{
			id: 1,
			createdOn: '13-12-2019',
			loanId: 1,
			amount: 5000
		},
		{
			id: 2,
			createdOn: '13-12-2020',
			loanId: 2,
			amount: 5000
		}
	]
};

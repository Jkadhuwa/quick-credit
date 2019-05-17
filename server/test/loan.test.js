import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const request = require('supertest')(app);

const { expect } = chai;

chai.use(chaiHttp);

// Mark user verified with valid inputs

let userToken = null;
let adminToken = null;
let user1Token = null;

before((done) => {
	const admin = {
		email: 'joankadzo@gmail.com',
		password: 'Joankadzo1'
	};
	const user = {
		email: 'justinemsinda@gmail.com',
		password: 'Kalume!1'
	};
	const user1 = {
		email: 'kja2aro@gmail.com',
		password: 'Kalume!1'
	};
	request
		.post('/api/v1/auth/signin')
		.send(user1)
		.end((err, res) => {
			if (err) throw err;
			user1Token = res.body.data.token;
		});
	request
		.post('/api/v1/auth/signin')
		.send(user)
		.end((err, res) => {
			if (err) throw err;
			userToken = res.body.data.token;
		});
	request
		.post('/api/v1/auth/signin')
		.send(admin)
		.end((err, res) => {
			if (err) throw err;
			adminToken = res.body.data.token;
			done();
		});
});

// CREATE /New Loan

describe('User applies a loan', () => {
	it('Should return status 201 with data of newly created loan application', (done) => {
		chai
			.request(app)
			.post('/api/v1/loans')
			.set('authorization', user1Token)
			.send({
				amount: '150000',
				tenor: '12'
			})
			.end((err, res) => {
				expect(res).to.have.status(201);
				expect(res.body.data).to.be.an('object');
				done();
			});
	});

	it('Should return status 409 with error message You already have a loan', (done) => {
		chai
			.request(app)
			.post('/api/v1/loans')
			.set('authorization', userToken)
			.send({
				amount: '150000',
				tenor: '12'
			})
			.end((err, res) => {
				expect(res).to.have.status(409);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('You already have a loan');
				done();
			});
	});

	it('Should return status 400 with error message Please ensure all fields are filled', (done) => {
		chai
			.request(app)
			.post('/api/v1/loans')
			.set('authorization', user1Token)
			.send({
				amount: '',
				tenor: ''
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Please ensure all fields are filled');
				done();
			});
	});
	it('Should return status 400 with error message Amount only takes Floating or Numeric values', (done) => {
		chai
			.request(app)
			.post('/api/v1/loans')
			.set('authorization', user1Token)
			.send({
				amount: 'helloo',
				tenor: '11'
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Amount only takes Floating or Numeric values');
				done();
			});
	});
	it('Should return status 400 with error message Amount only takes Takes numbers between 1 - 12', (done) => {
		chai
			.request(app)
			.post('/api/v1/loans')
			.set('authorization', user1Token)
			.send({
				amount: '50000',
				tenor: '18'
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Takes numbers between 1 - 12');
				done();
			});
	});
});
describe('Admin view  all loans', () => {
	describe('Return all Loans when successful', () => {
		it('Should return status 200 with data all loan appliocations', (done) => {
			chai
				.request(app)
				.get('/api/v1/loans')
				.set('authorization', adminToken)
				.send()
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.have.property('data');
					done();
				});
		});
	});
	it('Should return status 401 with error Invalid token', (done) => {
		chai
			.request(app)
			.get('/api/v1/loans')
			.set('authorization', 'adminToken')
			.end((err, res) => {
				expect(res).to.have.status(401);
				done();
			});
	});

	it('Should return status 403 with no token supplied', (done) => {
		chai
			.request(app)
			.get('/api/v1/loans')
			.set('authorization', '')
			.end((err, res) => {
				expect(res).to.have.status(403);
				done();
			});
	});

	it('Should return status 401 with error Only previledged users can view for normal users', (done) => {
		chai
			.request(app)
			.get('/api/v1/loans')
			.set('authorization', userToken)
			.send()
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res.body.error).to.equal(
					'You do not have enough priviledges to continue'
				);
				done();
			});
	});
});

// Admin tests

describe('Admin should view  specific loan', () => {
	it('Should return status 200 with data  loan appliocations of specified LoanId', (done) => {
		chai
			.request(app)
			.get('/api/v1/loans/1')
			.set('authorization', adminToken)
			.send()
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('data');
				done();
			});
	});

	it('Should return status 404 if no loan with the specied id is found', (done) => {
		chai
			.request(app)
			.get('/api/v1/loans/0')
			.set('authorization', adminToken)
			.send()
			.end((err, res) => {
				expect(res).to.have.status(404);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Loan not found ');
				done();
			});
	});
});
describe('Admin should view be able to Approve or Reject loan', () => {
	it('Should return status 200 with data of loan applications of specified LoanId', (done) => {
		chai
			.request(app)
			.patch('/api/v1/loans/1')
			.set('authorization', adminToken)
			.send()
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('data');
				expect(res.body.data).to.have.property('loanId');
				done();
			});
	});
	it('Should return status 401 with error Wrong token ', (done) => {
		chai
			.request(app)
			.patch('/api/v1/loans/1')
			.set('authorization', 'SBgpaZdIDdWlHUexc6m')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res.body).to.have.property('error');
				expect(res.body).to.have.property('status');
				expect(res.body.error).to.be.equal('Invalid Token supplied');
				done();
			});
	});
	it('Should return status 404 with error Wrong token ', (done) => {
		chai
			.request(app)
			.patch('/api/v1/loans/0')
			.set('authorization', adminToken)
			.send()
			.end((err, res) => {
				expect(res).to.have.status(404);
				expect(res.body).to.have.property('error');
				expect(res.body).to.have.property('status');
				expect(res.body.error).to.be.equal('Loan not found ');
				done();
			});
	});
	it('Should return status 401 with error dont have enough user previledge ', (done) => {
		chai
			.request(app)
			.patch('/api/v1/loans/0')
			.set('authorization', userToken)
			.send()
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res.body).to.have.property('error');
				expect(res.body).to.have.property('status');

				done();
			});
	});
});

// Create Loan Repayment Record

describe('Admin Should be able to create a loan repayment record', () => {
	it('Should return status 201 with data of loan repayment record', (done) => {
		chai
			.request(app)
			.post('/api/v1/loans/2/repayments')
			.set('authorization', adminToken)
			.send({ amount: '1000' })
			.end((err, res) => {
				expect(res).to.have.status(201);
				expect(res.body).to.have.property('data');
				expect(res.body.data).to.have.property('loanId');
				expect(res.body.data.balance).to.be.not.equal(null);
				done();
			});
	});
	it('Should return status 401 with error message of Token error', (done) => {
		chai
			.request(app)
			.post('/api/v1/loans/1/repayments')
			.set('authorization', 'SBgpaZdIDdWlexc46m')
			.send({
				amount: '1000'
			})
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Invalid Token supplied');
				done();
			});
	});
	it('Should return status 404 with error message of Loan Not Found ', (done) => {
		chai
			.request(app)
			.post('/api/v1/loans/0/repayments')
			.set('authorization', adminToken)
			.send({ amount: '1000' })
			.end((err, res) => {
				expect(res).to.have.status(404);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Loan Not Found');
				done();
			});
	});
	it('Should return status 400 with error message of Amount is required ', (done) => {
		chai
			.request(app)
			.post('/api/v1/loans/1/repayments')
			.set('authorization', adminToken)
			.send({ amount: '' })
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Amount is required');
				done();
			});
	});
	it('Should return status 400 with error message of Amount only takes Floating or Numeric values ', (done) => {
		chai
			.request(app)
			.post('/api/v1/loans/1/repayments')
			.set('authorization', adminToken)
			.send({ amount: 'fgtrdf' })
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Amount only takes Floating or Numeric values');
				done();
			});
	});
});

// View Loan Repayment History

describe('Admin Should be able to View a loan repayment history', () => {
	it('Should return status 200 with data of loan repayment history', (done) => {
		chai
			.request(app)
			.get('/api/v1/loans/1/repayments')
			.set('authorization', adminToken)
			.send({})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body.data).to.be.an('array');
				done();
			});
	});

	it('Should return status 404 with error Loan Not Found', (done) => {
		chai
			.request(app)
			.get('/api/v1/loans/0/repayments')
			.set('authorization', adminToken)
			.send()
			.end((err, res) => {
				expect(res).to.have.status(404);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Loan Not found');
				done();
			});
	});

	it('Should return status 401 with Token Error', (done) => {
		chai
			.request(app)
			.get('/api/v1/loans/2/repayments')
			.set('authorization', 'SBgpaZIDdWlHUexc4m')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Invalid Token supplied');
				done();
			});
	});
});

// Get all current loans(Not Fully paid)

describe('Admin Should be able to View all current loans', () => {
	it('Should return status 200 with data of all current loans', (done) => {
		chai
			.request(app)
			.get('/api/v1/loans?status=approved&repaid=false')
			.set('authorization', adminToken)
			.send()
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('data');
				expect(res.body.data).to.be.an('array');
				expect(res.body.data.balance).to.be.not.equal(null);
				done();
			});
	});

	it('Should return status 401 with data of Token error', (done) => {
		chai
			.request(app)
			.get('/api/v1/loans?status=approved&repaid=false')
			.set('authorization', 'SBgpaZIDdWlHUexc46m')
			.send({})
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Invalid Token supplied');
				done();
			});
	});

	it('Should return status 401 with data of Unauthorized access when the user is not Administartor', (done) => {
		chai
			.request(app)
			.get('/api/v1/loans?status=approved&repaid=false')
			.set('authorization', userToken)
			.send()
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal(
					'You do not have enough priviledges to continue'
				);
				done();
			});
	});
});

// Get all current loans(Not Fully paid)
describe('User Should be able to View a loan repayment history', () => {
	it('Should return status 200 with data of loan repayment history', (done) => {
		chai
			.request(app)
			.get('/api/v1/loans/1/repayments')
			.set('authorization', user1Token)
			.send({})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('data');
				expect(res.body.data).to.be.an('array');
				done();
			});
	});

	it('Should return status 404 with error Loan Not Found', (done) => {
		chai
			.request(app)
			.get('/api/v1/loans/0/repayments')
			.set('authorization', adminToken)
			.send()
			.end((err, res) => {
				expect(res).to.have.status(404);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Loan Not found');
				done();
			});
	});

	it('Should return status 401 with Token Error', (done) => {
		chai
			.request(app)
			.get('/api/v1/loans/2/repayments')
			.set('authorization', 'SBgpaZIDdWlHUexc4m')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Invalid Token supplied');
				done();
			});
	});
});

// Get all Repaid Loans

describe('Admin Should be able to View all repaid loans', () => {
	it('Should return status 200 with data of all repaid loans', (done) => {
		chai
			.request(app)
			.get('/api/v1/loans?status=approved&repaid=true')
			.set('authorization', adminToken)
			.send()
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('data');
				expect(res.body.data).to.be.an('array');
				expect(res.body.data.balance).to.be.not.equal(null);
				done();
			});
	});

	it('Should return status 401 with data of Token error', (done) => {
		chai
			.request(app)
			.get('/api/v1/loans?status=approved&repaid=true')
			.set('authorization', 'SBgpaZIDdWlHUexc46m')
			.send({})
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Invalid Token supplied');
				done();
			});
	});

	it('Should return status 401 with data of Unauthorized access when the user is not Administartor', (done) => {
		chai
			.request(app)
			.get('/api/v1/loans?status=approved&repaid=true')
			.set('authorization', userToken)
			.send()
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal(
					'You do not have enough priviledges to continue'
				);
				done();
			});
	});
});

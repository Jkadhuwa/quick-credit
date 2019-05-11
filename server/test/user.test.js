import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const request = require('supertest')(app);

const { expect } = chai;

chai.use(chaiHttp);

// Mark user verified with valid inputs

let userToken = null;
let adminToken = null;
before((done) => {
	const admin = {
		email: 'joankadzo@gmail.com',
		password: 'Joankadzo',
	};
	const user = {
		email: 'sam3ziro@gmail.com',
		password: 'Kadhush',
	};
	request.post('/api/v1/auth/signin')
		.send(user)
		.end((err, res) => {
			if (err) throw err;
			userToken = res.body.data.token;
		});
	request.post('/api/v1/auth/signin')
		.send(admin)
		.end((err, res) => {
			if (err) throw err;
			adminToken = res.body.data.token;
			done();
		});
});

describe('Admin can mark user as verified', () => {
	it('Should return status 200 with data of of the updated user', (done) => {
		chai
			.request(app)
			.patch('/api/v1/users/sam3ziro@gmail.com/verify')
			.set('authorization', adminToken)
			.send()
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body.data).to.be.an('object');
				expect(res.body.data.status).to.be.equal('verified');
				done();
			});
	});

	// Mark user verified with invalid email

	it('Should return status 404 with User not found error', (done) => {
		chai
			.request(app)
			.patch('/api/v1/users/sam3zirogmail.com/verify')
			.set('authorization', adminToken)
			.send()
			.end((err, res) => {
				expect(res).to.have.status(404);
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('error');
				done();
			});
	});
	it('Should return status 401 with an error message Token error', (done) => {
		chai
			.request(app)
			.get('/api/v1/users')
			.set('authorization', 'SBgpaZdIDdWlHUex6m')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('error');
				done();
			});
	});
});

// Admin can view all users

describe('Admin can view all users in the system', () => {
	it('Should returnr status 200 with a list of all users', (done) => {
		chai
			.request(app)
			.get('/api/v1/users')
			.set('authorization', adminToken)
			.send()
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('data');
				done();
			});
	});

	it('Should return status 401 with an error message Token error', (done) => {
		chai
			.request(app)
			.get('/api/v1/users')
			.set('authorization', 'SBgpaZdIDdWlHUex6m')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('error');
				done();
			});
	});
	it('Should return status 401 with an error message user does not have enough previledges', (done) => {
		chai
			.request(app)
			.get('/api/v1/users')
			.set('authorization', userToken)
			.send()
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('error');
				done();
			});
	});
});

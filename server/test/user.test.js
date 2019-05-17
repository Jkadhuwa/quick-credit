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
		password: 'Joankadzo1'
	};
	const user = {
		email: 'sam3ziro@gmail.com',
		password: 'Kadhush1'
	};
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

// CREATE /SIGN UP TESTS
describe('Create new user', () => {
	it('should return status 201 with data of newly created user', (done) => {
		chai
			.request(app)
			.post('/api/v1/auth/signup')
			.send({
				firstName: 'Stephen',
				lastName: 'Kalume',
				email: 'jameskalume@gmail.com',
				password: 'Joankdzo1',
				telephone: '0713723191',
				nationality: 'Tanzanian',
				workAddress: '12t'
			})
			.end((err, res) => {
				expect(res).to.have.status(201);
				expect(res.body.data).to.be.an('object');
				expect(res.body.data.id).to.be.a('number');
				expect(res.body.data)
					.to.have.property('token')
					.to.be.a('string');
				done();
			});
	});
	it('should return status 400 with error message Please ensure all fields are filled', (done) => {
		chai
			.request(app)
			.post('/api/v1/auth/signup')
			.send({
				firstName: '',
				lastName: '',
				email: '',
				password: '',
				telephone: '',
				workAddress: ''
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal(
					'Please ensure all fields are filled'
				);
				done();
			});
	});
	it('should return status 400 with error message Enter a valid First Name', (done) => {
		chai
			.request(app)
			.post('/api/v1/auth/signup')
			.send({
				firstName: 'sandra1000',
				lastName: 'Kerin',
				email: 'kadhuwa@gmail.com',
				password: 'Joankadzo1',
				telephone: '0745686958',
				nationality: 'kenyan',
				workAddress: '12 st'
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Enter a valid First Name');
				done();
			});
	});
	it('should return status 400 with error message Enter a valid Last Name', (done) => {
		chai
			.request(app)
			.post('/api/v1/auth/signup')
			.send({
				firstName: 'Sandrina',
				lastName: 'kerin1000',
				email: 'kadhuwa@gmail.com',
				password: 'Joankadzo1',
				telephone: '0745686958',
				nationality: 'kenyan',
				workAddress: '12 st'
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Enter a valid Last Name');
				done();
			});
	});
	it('should return status 409 with error message email already taken', (done) => {
		chai
			.request(app)
			.post('/api/v1/auth/signup')
			.send({
				firstName: 'Stephen',
				lastName: 'Kalume',
				email: 'jameskalume@gmail.com',
				password: 'Joankdzo1',
				telephone: '0713723191',
				nationality: 'Tanzanian',
				workAddress: '12t'
			})
			.end((err, res) => {
				expect(res).to.have.status(409);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Email already taken');
				done();
			});
	});
	it('should return status 400 with error message Enter a valid Email Address', (done) => {
		chai
			.request(app)
			.post('/api/v1/auth/signup')
			.send({
				firstName: 'Sandrina',
				lastName: 'Kerin',
				email: 'kadhuwa.com',
				password: 'Joankadzo1',
				telephone: '0745686958',
				nationality: 'kenyan',
				workAddress: '12 st'
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Enter a valid Email Address');
				done();
			});
	});

	it('should return status 400 with error message Enter a valid Phone number', (done) => {
		chai
			.request(app)
			.post('/api/v1/auth/signup')
			.send({
				firstName: 'Sandrina',
				lastName: 'Kerin',
				email: 'kadhuwa@gmail..com',
				password: 'Joankadzo1',
				telephone: '024568958',
				nationality: 'kenyan',
				workAddress: '12 st'
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Enter a valid Phone number');
				done();
			});
	});
	it('should return status 400 with error message Password should include atleast one uppercase, lowercase letters, a number and should have more than 6 characters', (done) => {
		chai
			.request(app)
			.post('/api/v1/auth/signup')
			.send({
				firstName: 'Sandrina',
				lastName: 'Kerin',
				email: 'kadhu@gmail..com',
				password: 'joankadzo',
				telephone: '074568958',
				nationality: 'kenyan',
				workAddress: '12 st'
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Password should include atleast one uppercase, lowercase letters, a number and should have more than 6 characters.');
				done();
			});
	});

	it('should return status 400 with error message Enter a Valid Country name', (done) => {
		chai
			.request(app)
			.post('/api/v1/auth/signup')
			.send({
				firstName: 'Sandrina',
				lastName: 'Kerin',
				email: 'kadwa@gmail..com',
				password: 'Joankadzo1',
				telephone: '0713723191',
				nationality: '142gtdd',
				workAddress: '12 st'
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Enter a Valid Country name');
				done();
			});
	});
	it('should return status 400 with error message Enter a Valid Country name', (done) => {
		chai
			.request(app)
			.post('/api/v1/auth/signup')
			.send({
				firstName: 'Sandrina',
				lastName: 'Kerin',
				email: 'kawa@gmail..com',
				password: 'Joankadzo1',
				telephone: '0713723191',
				nationality: 'Kenyan',
				workAddress: '!-4d'
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.be.equal('Enter a Valid work address');
				done();
			});
	});
});

// SIGN IN TESTS

describe('User sign in', () => {
	it('should return status 200 with data of the user', (done) => {
		chai
			.request(app)
			.post('/api/v1/auth/signin')
			.send({
				email: 'sam3ziro@gmail.com',
				password: 'Kadhush1'
			})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('data');
				done();
			});
	});

	it('should return status 401 with an error message when either password or email is wrong', (done) => {
		chai
			.request(app)
			.post('/api/v1/auth/signin')
			.send({
				email: 'samzir@gmail.com',
				password: 'Kdhush'
			})
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res.body).to.have.property('error');
				done();
			});
	});

	it('should return status 400 with an error message Check email format', (done) => {
		chai
			.request(app)
			.post('/api/v1/auth/signin')
			.send({
				email: 'samzirogmail.com',
				password: 'Kadhush'
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('error');
				done();
			});
	});
	it('should return status 400 with an error message password should have more than 6 characters', (done) => {
		chai
			.request(app)
			.post('/api/v1/auth/signin')
			.send({
				email: 'samziro@gmail.com',
				password: 'Kdh'
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('error');
				done();
			});
	});
	it('should return status 400 with an error message email or password can can not be empty', (done) => {
		chai
			.request(app)
			.post('/api/v1/auth/signin')
			.send({
				email: '',
				password: ''
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('error');
				done();
			});
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
				expect(res.body.data).to.be.an('array');
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

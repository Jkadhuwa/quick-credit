/* eslint-disable max-len */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../app';
import Data from '../db';
import Auth from '../helpers/auth';
import userMock from '../mock_db/usermockdb';

const { expect } = chai;

chai.use(chaiHttp);

let userToken;
let adminToken;

// CREATE /SIGN UP TESTS
describe('', () => {
	before('gen token', (done) => {
		const admin = {
			firstname: 'samuel',
			lastname: 'ziro',
			email: 'sam3iro@gmail.com',
			password: Auth.hashPassword('kadhuwaA12'),
			nationality: 'Kenyan',
			telephone: '0713723191',
			workaddress: 'Malindi',
			status: 'verified',
			isadmin: true
		};

		const user = {
			firstName: 'Musinda',
			lastName: 'Kadhuwa',
			email: 'jaymusinda@live.com',
			password: 'kadhuwaA12',
			nationality: 'Kenyan',
			telephone: '0713723191',
			workAddress: 'Malindi',
			status: 'unverified',
			isAdmin: false
		};

		userToken = jwt.sign(
			{
				isAdmin: false,
				email: 'jaymusinda@live.com'
			},
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);

		adminToken = jwt.sign(
			{
				isAdmin: true,
				email: 'sam3iro@gmail.com'
			},
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);

		const { rows } = new Data().query('INSERT INTO users (firstname, lastname, email, password, nationality, telephone, workaddress, status, isadmin) values($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9) returning *',
			[user.firstname, user.lastname, user.email, user.password, user.nationality, user.telephone, user.workaddress, user.status, user.isadmin]);
		done();
	});

	after('after all test', (done) => {
		new Data().query('DROP TABLE users');
		done();
	});

	describe('Create new user', () => {
		it('should return status 201 with data of newly created user', () => {
			chai
				.request(app)
				.post('/api/v1/auth/signup')
				.send(userMock.user1)
				.end((err, res) => {
					expect(res).to.have.status(201);
					expect(res.body.data).to.be.an('object');
					expect(res.body.data)
						.to.have.property('token')
						.to.be.a('string');
				});
		});
		it('should return status 400 with error message Please ensure all fields are filled', () => {
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
				});
		});

		it('should return status 400 with error message Enter a valid First Name', () => {
			chai
				.request(app)
				.post('/api/v1/auth/signup')
				.send(userMock.user2)
				.end((err, res) => {
					expect(res).to.have.status(400);
					expect(res.body).to.have.property('error');
					expect(res.body.error).to.be.equal('Enter a valid First Name');
				});
		});

		it('should return status 400 with error message Enter a valid Last Name', () => {
			chai
				.request(app)
				.post('/api/v1/auth/signup')
				.send(userMock.user9)
				.end((err, res) => {
					expect(res).to.have.status(400);
					expect(res.body).to.have.property('error');
					expect(res.body.error).to.be.equal('Enter a valid Last Name');
				});
		});

		it('should return status 400 with error message Enter a valid Email Address', () => {
			chai
				.request(app)
				.post('/api/v1/auth/signup')
				.send(userMock.user3)
				.end((err, res) => {
					expect(res).to.have.status(400);
					expect(res.body).to.have.property('error');
					expect(res.body.error).to.be.equal('Enter a valid Email Address');
				});
		});

		it('should return status 400 with error message Enter a valid Phone number', () => {
			chai
				.request(app)
				.post('/api/v1/auth/signup')
				.send(userMock.user4)
				.end((err, res) => {
					expect(res).to.have.status(400);
					expect(res.body).to.have.property('error');
					expect(res.body.error).to.be.equal('Enter a valid Phone number');
				});
		});

		it('should return status 400 with error message Password should include atleast one uppercase, lowercase letters, a number and should have more than 6 characters', (done) => {
			chai
				.request(app)
				.post('/api/v1/auth/signup')
				.send(userMock.user5)
				.end((err, res) => {
					expect(res).to.have.status(400);
					expect(res.body).to.have.property('error');
					expect(res.body.error).to.be.equal('Password should include atleast one uppercase, lowercase letters, a number and should have more than 6 characters.');
					done();
				});
		});

		it('should return status 400 with error message Enter a Valid Country name', () => {
			chai
				.request(app)
				.post('/api/v1/auth/signup')
				.send(userMock.user6)
				.end((err, res) => {
					expect(res).to.have.status(400);
					expect(res.body).to.have.property('error');
					expect(res.body.error).to.be.equal('Enter a Valid Country name');
				});
		});

		it('should return status 400 with error message Enter a Valid work address', () => {
			chai
				.request(app)
				.post('/api/v1/auth/signup')
				.send(userMock.user7)
				.end((err, res) => {
					expect(res).to.have.status(400);
					expect(res.body).to.have.property('error');
					expect(res.body.error).to.be.equal('Enter a Valid work address');
				});
		});
		it('should return status 409 with error message email already taken', () => {
			chai
				.request(app)
				.post('/api/v1/auth/signup')
				.send(userMock.user8)
				.end((err, res) => {
					expect(res).to.have.status(409);
					expect(res.body).to.have.property('error');
					expect(res.body.error).to.be.equal('Email already in use');
				});
		});
	});

	// Sign in tests
	describe('User sign in', (done) => {
		it('should return status 200 with data of the user', () => {
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
				});
		});

		it('should return status 401 with an error message when either password or email is wrong', () => {
			chai
				.request(app)
				.post('/api/v1/auth/signin')
				.send({
					email: 'sam3ziro@gmail.com',
					password: 'Kdhush'
				})
				.end((err, res) => {
					expect(res).to.have.status(401);
					expect(res.body).to.have.property('error');
				});
		});
		it('should return status 400 with an error message Check email format', () => {
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
				});
		});
		it('should return status 400 with an error message password should have more than 6 characters', () => {
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
				});
		});
		it('should return status 400 with an error message email or password can can not be empty', () => {
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
				});
		});
	});

	// Admin view users
	describe('Admin can view all users in the system', (done) => {
		it('Should returnr status 200 with a list of all users', () => {
			chai
				.request(app)
				.get('/api/v1/users')
				.set('authorization', `Bearer ${adminToken}`)
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('data');
					expect(res.body.data).to.be.an('array');
				});
		});

		it('Should return status 401 with an error message Token error', () => {
			chai
				.request(app)
				.get('/api/v1/users')
				.set('authorition', `Bearer ${adminToken}`)
				.send()
				.end((err, res) => {
					expect(res).to.have.status(401);
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('error');
				});
		});
		it('Should return status 401 with an error message user does not have enough previledges', () => {
			chai
				.request(app)
				.get('/api/v1/users')
				.set('authorization', `Bearer ewidcbfdierffndvj`)
				.send()
				.end((err, res) => {
					expect(res).to.have.status(401);
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('error');
				});
		});
	});
	// Admin view single user
	describe('Admin can view single users in the system', (done) => {
		it('Should return status 200 with user details', () => {
			chai
				.request(app)
				.get('/api/v1/users/sam3ziro@gmail.com')
				.set('authorization', `Bearer ${adminToken}`)
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('data');
					expect(res.body.data).to.be.an('object');
				});
		});

		it('Should return status 401 with an error message Token error', () => {
			chai
				.request(app)
				.get('/api/v1/users')
				.set('authorization', `Bearer $rdghgduscxs`)
				.send()
				.end((err, res) => {
					expect(res).to.have.status(401);
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('error');
				});
		});
		it('Should return status 401 with an error message user does not have enough previledges', () => {
			chai
				.request(app)
				.get('/api/v1/users')
				.set('authorization', `Bearer ${userToken}`)
				.send()
				.end((err, res) => {
					expect(res).to.have.status(401);
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('error');
				});
		});
	});

	// Admin can verify user
	describe('Admin can mark user as verified', () => {
		it('Should return status 200 with data of of the updated user', (done) => {
			chai
				.request(app)
				.patch('/api/v1/users/sam3ziro@gmail.com/verify')
				.set('authorization', `Bearer ${adminToken}`)
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body.data).to.be.an('object');
					expect(res.body.data.userstatus).to.be.equal('verified');
					done();
				});
		});
	});
});

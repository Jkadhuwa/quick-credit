import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

// CREATE /SIGN UP TESTS
describe('Create new user', () => {
	it('should return status 201 with data of newly created user', (done) => {
		chai
			.request(app)
			.post('/api/v1/auth/signup')
			.send({
				firstName: 'kames',
				lastName: 'Kalume',
				email: 'james.kalume@gmail.com',
				password: 'joankadzo',
				telephone: '0713723191',
				address: '11 st',
				workAddress: '12 st'
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

	it('should return status 400 with error message Fields can not be empty', (done) => {
		chai
			.request(app)
			.post('/api/v1/auth/signup')
			.send({
				firstName: '',
				lastName: '',
				email: '',
				password: '',
				telephone: '',
				address: '',
				workAddress: ''
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('error');
				done();
			});
	});
	it('should return status 400 with error message check email or telephone format', (done) => {
		chai
			.request(app)
			.post('/api/v1/auth/signup')
			.send({
				firstName: 'Sandrina',
				lastName: 'Kerin',
				email: 'kadhuwa.com',
				password: 'Joankadzo',
				telephone: '094568698',
				address: '11th st',
				workAddress: '12 st'
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('error');
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
				password: 'Kadhush'
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

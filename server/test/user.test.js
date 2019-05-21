import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../app';
import Data from '../db';
import Auth from '../helpers/auth';

const { expect } = chai;

chai.use(chaiHttp);

let userToken;
let adminToken;

// CREATE /SIGN UP TESTS
describe('', () => {
	before('gen token', (done) => {
		const admin = {
			firstName: 'samuel',
			lastName: 'ziro',
			email: 'sam3iro@gmail.com',
			password: Auth.hashPassword('kadhuwaA12'),
			nationality: 'Kenyan',
			telephone: '0713723191',
			workAddress: 'Malindi',
			statud: 'verified',
			isAdmin: true
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
		new Data().query('INSERT INTO users (firstname, lastname, email, password, nationality, telephone, workAddress, status, isAdmin) values($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9)',
			[user.firstname, user.lastname, user.email, user.password, user.nationality, user.telephone,
				user.workAddress, user.status, user.isAdmin]);
		new Data().query('INSERT INTO users (firstname, lastname, email, password,  nationality, telephone, workAddress, status, isAdmin) values($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9)',
			[admin.firstname, admin.lastname, admin.email, admin.password, admin.nationality, admin.telephone,
				admin.workAddress, admin.status, admin.isAdmin]);
		done();
	});


	describe('Create new user', () => {
		it('should return status 201 with data of newly created user', () => {
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
					workAddress: '12t',
					isAdmin: 'false'
				})
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
				});
		});
		it('should return status 400 with error message Enter a valid Last Name', () => {
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
				});
		});
		it('should return status 409 with error message email already taken', () => {
			chai
				.request(app)
				.post('/api/v1/auth/signup')
				.send({
					firstName: 'Stephen',
					lastName: 'Kalume',
					email: 'jaymusinda@live.com',
					password: 'Joankdzo1',
					telephone: '0713723191',
					nationality: 'Tanzanian',
					workAddress: '12t'
				})
				.end((err, res) => {
					expect(res).to.have.status(409);
					expect(res.body).to.have.property('error');
					expect(res.body.error).to.be.equal('Email already taken');
				});
		});
		it('should return status 400 with error message Enter a valid Email Address', () => {
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
				});
		});

		it('should return status 400 with error message Enter a valid Phone number', () => {
			chai
				.request(app)
				.post('/api/v1/auth/signup')
				.send({
					firstName: 'Sandrina',
					lastName: 'Kerin',
					email: 'kadhuwa@gmail..com',
					password: 'Joankadzo1',
					telephone: '04568958',
					nationality: 'kenyan',
					workAddress: '12 st'
				})
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

		it('should return status 400 with error message Enter a Valid Country name', () => {
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
				});
		});
		it('should return status 400 with error message Enter a Valid Country name', () => {
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
				});
		});
	});
});

import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../app';
import Data from '../db';
import Auth from '../helpers/auth';

const { expect } = chai;

chai.use(chaiHttp);

// Mark user verified with valid inputs

let userToken = null;
let adminToken = null;
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
	// CREATE /New Loan

	describe('User applies a loan', (done) => {
		it('Should return status 201 with data of newly created loan application', () => {
			chai
				.request(app)
				.post('/api/v1/loans')
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: '150000',
					tenor: '12'
				})
				.end((err, res) => {
					expect(res).to.have.status(201);
					expect(res.body.data).to.be.an('object');
				});
		});

		it('Should return status 409 with error message You already have a loan', () => {
			chai
				.request(app)
				.post('/api/v1/loans')
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: '150000',
					tenor: '12'
				})
				.end((err, res) => {
					expect(res).to.have.status(409);
					expect(res.body).to.have.property('error');
					expect(res.body.error).to.be.equal('You already have a loan');
				});
		});

		it('Should return status 400 with error message Please ensure all fields are filled', () => {
			chai
				.request(app)
				.post('/api/v1/loans')
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: '',
					tenor: ''
				})
				.end((err, res) => {
					expect(res).to.have.status(400);
					expect(res.body).to.have.property('error');
					expect(res.body.error).to.be.equal('Please ensure all fields are filled');
				});
		});
		it('Should return status 400 with error message Amount only takes Floating or Numeric values', () => {
			chai
				.request(app)
				.post('/api/v1/loans')
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: 'helloo',
					tenor: '11'
				})
				.end((err, res) => {
					expect(res).to.have.status(400);
					expect(res.body).to.have.property('error');
					expect(res.body.error).to.be.equal('Amount only takes Floating or Numeric values');
				});
		});
		it('Should return status 400 with error message Amount only takes Takes numbers between 1 - 12', () => {
			chai
				.request(app)
				.post('/api/v1/loans')
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: '50000',
					tenor: '18'
				})
				.end((err, res) => {
					expect(res).to.have.status(400);
					expect(res.body).to.have.property('error');
					expect(res.body.error).to.be.equal('Takes numbers between 1 - 12');
				});
		});
	});
});

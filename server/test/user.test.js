import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

// Mark user verified with valid inputs

describe('Admin can mark user as verified', () => {
	it('Should return status 200 with data of of the updated user', (done) => {
		chai
			.request(app)
			.patch('/api/v1/users/sam3ziro@gmail.com/verify')
			.set('access-token', 'SBgpaZdIDdWlHUexc46m')
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
			.set('access-token', 'SBgpaZdIDdWlHUexc46m')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(404);
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('error');
				done();
			});
	});
});

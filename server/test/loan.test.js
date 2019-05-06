import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

// CREATE /SIGN UP TESTS

describe('User applies a loan', () => {
  it('Should return status 201 with data of newly created loan application', (done) => {
    chai
      .request(app)
      .post('/api/v1/loans')
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
});

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

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
        done();
      });
  });
});

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

describe('User should be able to view front end pages', () => {
  it('Should returrn status 200', (done) => {
    chai
      .request(app.listen())
      .get('/api/v1')
      .end((err, res) => {
        if (err) {
          throw err;
        } else {
          expect(res).to.have.status(200);
        }
      });
    done();
  });
});

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
      .set('access-token', 'SBgpaZdIDdWlHUexc46m')
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
describe('Admin view  all loans', () => {
  it('Should return status 200 with data all loan appliocations', (done) => {
    chai
      .request(app)
      .get('/api/v1/loans')
      .set('access-token', 'SBgpaZdIDdWlHUexc46m')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        done();
      });
  });

  it('Should return status 401 with error Invalid token', (done) => {
    chai
      .request(app)
      .get('/api/v1/loans')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('Should return status 401 with error Only previledged users can view for normal users', (done) => {
    chai
      .request(app)
      .get('/api/v1/loans')
      .set('access-token', 'SBgpaZdIDdWlHUexc4m')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.error).to.equal('Only previledged users can view ');
        done();
      });
  });
});

// Adnin tests

describe('Admin should view  specific loan', () => {
  it('Should return status 200 with data  loan appliocations of specified LoanId', (done) => {
    chai
      .request(app)
      .get('/api/v1/loans/1')
      .set('access-token', 'SBgpaZdIDdWlHUexc46m')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        done();
      });
  });

  it('Should return status 404 if no loan with the specied id is found', (done) => {
    chai
      .request(app)
      .get('/api/v1/loans/0')
      .set('access-token', 'SBgpaZdIDdWlHUexc46m')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.equal('Loan not found ');
        done();
      });
  });
  it('Should return status 404 if no loan with the specied id is found', (done) => {
    chai
      .request(app)
      .get('/api/v1/loans/0')
      .set('access-token', 'SBgpaZdIDdWlHUexc46m')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.equal('Loan not found ');
        done();
      });
  });
});
describe('Admin should view be able to Approve or Reject loan', () => {
  it('Should return status 200 with data of loan applications of specified LoanId', (done) => {
    chai
      .request(app)
      .patch('/api/v1/loans/1')
      .set('access-token', 'SBgpaZdIDdWlHUexc46m')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('loanId');
        done();
      });
  });
  it('Should return status 401 with error Wrong token ', (done) => {
    chai
      .request(app)
      .patch('/api/v1/loans/1')
      .set('access-token', 'SBgpaZdIDdWlHUexc6m')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('status');
        expect(res.body.error).to.be.equal('Token error');
        done();
      });
  });
  it('Should return status 404 with error Wrong token ', (done) => {
    chai
      .request(app)
      .patch('/api/v1/loans/0')
      .set('access-token', 'SBgpaZdIDdWlHUexc46m')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('status');
        expect(res.body.error).to.be.equal('Loan not found ');
        done();
      });
  });
  it('Should return status 404 with error dont have enough user previledge ', (done) => {
    chai
      .request(app)
      .patch('/api/v1/loans/0')
      .set('access-token', 'SBgpaZdIDdWlHUexc4m')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('status');

        done();
      });
  });
});

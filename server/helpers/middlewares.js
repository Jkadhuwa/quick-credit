/* eslint-disable no-plusplus */
/* eslint-disable arrow-body-style */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
import data from '../mock_db/database';
import statusCode from './statuses';

class TokenVerification {
  checkToken(req, res, next) {
    const reqToken = req.headers['access-token'];
    for (let i = 0; i < data.users.length; i++) {
      if (data.users[i].token === reqToken) {
        next();
      }
    }
  }
}

const tokenVer = new TokenVerification();
export default tokenVer;

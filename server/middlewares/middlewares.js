/* eslint-disable class-methods-use-this */
import data from '../mock_db/database';
import statusCode from '../helpers/statuses';

class TokenVerification {
  checkToken(req, res, next) {
    const reqToken = req.headers['access-token'];
    for (let i = 0; i < data.users.length; i += 1) {
      if (data.users[i].token === reqToken) {
        next();
      }
    }
    return res
      .status(statusCode.UNAUTHORIZED)
      .send({ status: statusCode.UNAUTHORIZED, error: 'Token error' });
  }
}

const tokenVer = new TokenVerification();
export default tokenVer;

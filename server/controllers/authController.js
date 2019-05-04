/* eslint-disable radix */
/* eslint-disable class-methods-use-this */
import data from '../mock_db/database';
import { createToken, unUsedEmail } from '../helpers/helper';
import { validate } from '../helpers/validator';
import statusCode from '../helpers/statuses';

class AuthController {
  createUser(req, res) {
    if (validate(req.body).length > 0) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send({ status: statusCode.BAD_REQUEST, error: validate(req.body) });
    }
    if (unUsedEmail(req.body.email) > -1) {
      return res
        .status(statusCode.CONFLICT)
        .send({ status: statusCode.CONFLICT, error: 'Email already taken!!' });
    }

    const user = {
      token: createToken(),
      id: data.users.length + 1,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      address: req.body.address,
      nationality: req.body.nationality,
      telephone: req.body.telephone,
      workAddress: req.body.workAddress,
      status: 'Unverified',
      isAdmin: false
    };

    const currentTotalUsers = parseInt(data.users.length);
    let currentStatus = 0;
    data.users.push(user);
    if (data.users.length - currentTotalUsers === 1) {
      currentStatus = statusCode.STATUS_CREATED;
    }

    return res.status(currentStatus).send({
      status: currentStatus,
      data: {
        token: user.token,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        telephone: user.telephone,
        nationality: user.nationality,
        workAddress: user.workAddress
      }
    });
  }
}
const authController = new AuthController();
export default authController;

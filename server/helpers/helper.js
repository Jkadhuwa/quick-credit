/* eslint-disable operator-linebreak */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable arrow-body-style */
import data from '../mock_db/database';

const createToken = () => {
  let token = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 20; i++) {
    token += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return token;
};
const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

const isValidTelephone = (telephone) => {
  return /^07(?:(?:[129][0-9])|(?:0[0-8])|(4[0-1]))[0-9]{6}$/.test(telephone);
};

const unUsedEmail = (email) => {
  let userFound = false;
  data.users.map((user) => {
    if (user.email === email) {
      userFound = true;
    }
    return userFound;
  });
};

module.exports = {
  createToken,
  isValidEmail,
  isValidTelephone,
  unUsedEmail
};

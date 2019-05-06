/* eslint-disable import/named */
/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
import { isValidEmail, isValidTelephone } from './helper';

const validate = (data) => {
  let errorMsg = '';

  if (data.firstName === '') {
    errorMsg += 'First name is required, ';
  }

  if (data.lastName === '') {
    errorMsg += 'Last name is required, ';
  }

  if (data.password === '') {
    errorMsg += 'Password is required , ';
  } else if (data.password.length < 6) {
    errorMsg += 'Password should not be less than six!!, ';
  }

  if (data.email === '') {
    errorMsg += 'Email is required ,';
  } else if (!isValidEmail(data.email)) {
    errorMsg += 'Please check email format ,';
  }
  if (data.address === '') {
    errorMsg += 'Address is required,';
  }
  if (data.telephone === '') {
    errorMsg += 'Telephone is required , ';
  } else if (!isValidTelephone(data.telephone)) {
    errorMsg += 'Please check the telephone format, ';
  }
  if (data.workAddress === '') {
    errorMsg += 'Work Address is required,';
  }
  if (data.nationality === '') {
    errorMsg += 'Nationality is required,';
  }

  return errorMsg;
};

// Validate login
const validateLogin = (data) => {
  let errorMsg = '';
  if (data.email === '') {
    errorMsg += 'Email is required ,';
  } else if (!isValidEmail(data.email)) {
    errorMsg += 'Please check email format ,';
  }
  if (data.password === '') {
    errorMsg += 'Password is required , ';
  } else if (data.password.length < 6) {
    errorMsg += 'Password should not be less than six characters!!!, ';
  }
  return errorMsg;
};

const validateLoan = (data) => {
  let errorMsg = '';

  if (data.amount === '') {
    errorMsg += 'Amount is required, ';
  } else if (data.amount < 1) {
    errorMsg += 'Amount can not be 0 or below ,';
  }
  if (data.tenor === '') {
    errorMsg += 'Tenor is required,';
  } else if (data.tenor < 1 || data.tenor > 12) {
    errorMsg += 'Amount can not be less than 1 or greater than 12, ';
  }
};
module.exports = {
  validate,
  validateLogin,
  validateLoan
};

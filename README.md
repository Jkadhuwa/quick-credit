# QUICK-CREDIT ANDELA-KIGALI BOOTCAMP ADC.

**An Online lending platform that provide short-term soft loans to individuals. This helps solve problems of financial inclusion as a way to alleviate poverty and empower low income earners** `*We Love To See You Grow**`

## **BADGES**

[![Build Status](https://travis-ci.org/Jkadhuwa/quick-credit.svg?branch=develop)](https://travis-ci.org/Jkadhuwa/quick-credit)
[![Coverage Status](https://coveralls.io/repos/github/Jkadhuwa/quick-credit/badge.svg?branch=develop)](https://coveralls.io/github/Jkadhuwa/quick-credit?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/4ca4a4603f8a592be4bf/maintainability)](https://codeclimate.com/github/Jkadhuwa/quick-credit/maintainability)

## **Tools Used**

- `NodeJS`- Web Server
- `ExpressJs` - Server framework
- `ESLint` - JavaScript code and syntax linter
- `Babel` - ES6 javascript transpiler
- `Mocha` - Javascript test framework
- `Chai` - Javascript Assertion library
- `Instanbul` - Test coverage tool
- `nyc` - instanbul's commandline interface
- `Postman` - for tetsing API endpoints

## **Installing / Getting started**

- Clone the repository using `https://github.com/Jkadhuwa/quick-credit.git`
- Install all dependencies using `npm install`
- To run tests `npm tets`
- To run server `npm run dev`

**Initial Configuration**

- Please set all environmental viriables :
  ```
   PORT=8080,
   NODE_ENV=test,
   JWT_SECRET= *your secret key*
  ```

## Features

This projecct enable the Client and Admin to carry out the following tasks:

- Users can `signup` and `signin`

Clients can :

- `apply for a loan`

Admin can:

- `Mark users as verified`
- `Approve or reject loan application`
- `View all users`
- `View single users`
- `View all loans`
- `View specific loan`

#### API End Points

---

Used to serve the front end pages

1. `POST /api/v1/auth/signup`

   used to create a new user

   ```

    firstName: Musinda         //string
    lastName: Kadhuwa          //string
    email: jkadhuwa@live.com   //string
    password: qwerty           //string
    telephone: 0713723191      //int
    nationality: Kenyan        //string
    workAddress: Kigali        //string
    isadmin                    // Boolean
   ```

2. `POST /api/v1/signin`

   Used by user to access their accounts

   ```
   email: jaym@gmail.com //string
   password: qwertyu     // string
   ```

3. `GET /api/v1/users`

   Used by administrator to view all users

   ```
   Get the token provided when the user signs up or logs in
   and set it in headers in postman with authorization key.

   authorization | < token >
   ```

```

4) `GET /api/v1/users/:userEmail`
Used by administartor to to view specific user ussing their email address
```

-Get the token supplied during login or signup and set it in headers with authorization key.

- In the url path set the user email

  /api/v1/users/kenyamoja@gmail.com //string

  ```

  ```

5. `PATCH /api/v1/users/:userEmail/verify`
   Used by administartor to change the status of a user from unverified to verified

   ```
   -Get the token supplied during login or signup and set it in headers with authorization key.

   -  In the url path set the user email

    /api/v1/users/kenyamoja@gmail.com/verify   //string
   `
   ```

6) `GET /api/v1/loans`

   Used by administartor to view all loans.

   ```
   - Login as an admin and get the token, set it in postman headers with authorization.
   - authorization | < token >
   ```

7) `POST /api/v1/loans`

   used by client to create a loan application

   ```
   Login as a user and copy the token. Set it in header with authorization key.

   supply the following data:
   ---
   amount: 50000.0      //float or numbers
   tenor:  12           //number(int) between 1 nad 12
   ```

8) `GET /api/v1/loans/:loanId`

   - Used byt admin to view a specific user

   ```
   Login as an administartor and get the supplied token.
   Set the token in headers with authorization key.

   /api/v1/loans/1
   ```

9) `PATCH /api/v1/loans/:loanId`

   - used by admin to change the loan status from pending to either approved or rejected

   ```
   Login as an admin and copy the token supplied .
   Set the token in the postman headers with key as authorization
   supply a string value of either approved or rejected.

   /api/v1/loans/2

   status: 'approved'          //string
   ```

#### Contributing

---

Hello smart people. If you you would like to contribute into this project so as to make it better please do not hesitate, fork the project and use a feature branch. I will be humbled to receive pull request from you.

### Links

---

**Project Management**

[Pivotal Tracker](https://www.pivotaltracker.com/n/projects/2326513)

**Front End Pages**

[Front End Pages](https://jkadhuwa.github.io/quick-credit/UI)

**API End Points**

[Api End Point deployment](https://quick-credit-adc.herokuapp.com)

**API Documentation**

[API Documentation](https://quick-credit-adc.herokuapp.com/doc)

### Licence

**MIT**

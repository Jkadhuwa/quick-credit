/* eslint-disable indent */
module.exports = {
  users: [
    {
      id: 1,
      email: 'jaymusinda@live.com',
      firstName: 'Musinda',
      lastName: 'Kadhuwa',
      password: 'Kadhush',
      address: 'Clay works appt 4, Seasons st Kasarani',
      status: 'verified',
      isAdmin: true
    },
    {
      id: 2,
      email: 'joankadzo@gmail.com',
      firstName: 'Joan',
      lastName: 'Kadzo',
      password: 'Joankadzo',
      address: 'Majengo plt No 415, Malindi',
      status: 'verified',
      isAdmin: false
    },
    {
      id: 3,
      email: 'sam3ziro@gmail.com',
      firstName: 'Samuel',
      lastName: 'Ziro',
      password: 'Kadhush',
      address: 'GSU Barracks, Embakasi',
      status: 'unverified',
      isAdmin: false
    },
    {
      id: 4,
      email: 'kja2aro@gmail.com',
      firstName: 'James',
      lastName: 'Saro',
      password: 'kalume!',
      address: 'Clay works appt 6, Seasons st Kasarani',
      status: 'verified',
      isAdmin: false
    }
  ],
  loans: [
    {
      id: 1,
      user: 'sam3ziro@gmail.com',
      createdOn: '12-10-2019',
      status: 'Pending',
      repaid: false,
      tenor: 3,
      amount: 50000,
      balance: 50000,
      interest: 2500
    },
    {
      id: 2,
      user: 'joankadzo@gmail.com',
      createdOn: '12-10-2019',
      status: 'approved',
      repaid: false,
      tenor: 4,
      amount: 10000,
      balance: 5000,
      interest: 500
    },
    {
      id: 3,
      user: 'kja2aro@gmail.com',
      createdOn: '12-10-2019',
      status: 'rejected',
      repaid: false,
      tenor: 4,
      amount: 10000,
      balance: 0,
      interest: 500
    }
  ],
  repayments: [
    {
      id: 2,
      createdOn: '13-12-2019',
      loanId: 1,
      amount: 5000
    }
  ]
};

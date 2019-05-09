import chai from 'chai';
import assert from 'assert';
import helper from '../helpers/helper';

describe('Calculate balance ', () => {
  it('should get the difference of the argument', () => {
    assert.equal(1000, helper.balance(2000, 1000));
  });
});

describe('Calculate totalAmount ', () => {
  it('should calculate the Total amount payable when user enters loan request', () => {
    assert.equal(525, helper.totalAmount(500));
  });
});

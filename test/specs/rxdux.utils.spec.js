import { expect, assert } from 'chai';
import * as utils from 'Src/rxdux/utils';

describe('The Rxdux Utility File', () => {
  const view = 'eli';
  const filterGroup = null;

  it('should have [calculatePagination] method', () => assert.typeOf(utils.calculatePagination, 'function'));
  
  it('getFilters should return a filter object with sort, pagination, and filtering, given a state object', () => {
    const paginationParams = utils.calculatePagination(
      {totalItems: 1000}, 
      {_pagination: {
        skip: 50,
        take: 25,
        totalItems: 1000
      }}
      );

    expect(paginationParams).to.eql({
      totalItems: 1000,
      page: 3,
      totalPages: 40
    });
  });

});
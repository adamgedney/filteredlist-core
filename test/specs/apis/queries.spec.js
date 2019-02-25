import { expect } from 'chai';
import QueriesApi from 'Src/apis/queries.js';
import optionsExample from 'Src/options.example.js';

describe('The Queries API ', () => {
  let queriesApi;
  beforeEach(function() {
    queriesApi = new QueriesApi(optionsExample);
  });

	it('should instantiate', () => {
    expect(queriesApi).to.be.instanceOf(QueriesApi);
  });
});
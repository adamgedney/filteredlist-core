import { expect } from 'chai';
import DataApi from 'Src/apis/data.js';
import optionsExample from 'Src/options.example.js';

describe('The Data API ', () => {
  let dataApi;
  beforeEach(function() {
    dataApi = new DataApi(optionsExample);
  });

	it('should instantiate', () => {
    expect(dataApi).to.be.instanceOf(DataApi);
  });
});
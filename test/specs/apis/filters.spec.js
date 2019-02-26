import { expect } from 'chai';
import FiltersApi from 'Src/apis/filters.js';
import Views from 'Src/apis/views.js';
import optionsExample from 'Src/options.example.js';

describe('The Filters API ', () => {
  let filtersApi;
  beforeEach(function() {
    filtersApi = new FiltersApi(optionsExample);
  });

	it('should instantiate', () => {
    expect(filtersApi).to.be.instanceOf(FiltersApi);
  });

	it('should instantiate views', () => {
    expect(filtersApi.views).to.be.instanceOf(Views);
  });
});
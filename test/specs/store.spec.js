import { expect } from 'chai';
import Store from 'Src/store.js';
import optionsExample from 'Src/options.example.js';

describe('The Store', () => {
  let store;
  beforeEach(function() {
    store = new Store(optionsExample);
  });

	it('should instantiate', () => {
    expect(store).to.be.instanceOf(Store);
  });
});
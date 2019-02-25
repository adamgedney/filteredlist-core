import { expect } from 'chai';
import ViewsApi from 'Src/apis/views.js';
import optionsExample from 'Src/options.example.js';

describe('The Views API ', () => {
  let viewsApi;
  beforeEach(function() {
    viewsApi = new ViewsApi(optionsExample);
  });

	it('should instantiate', () => {
    expect(viewsApi).to.be.instanceOf(ViewsApi);
  });
});
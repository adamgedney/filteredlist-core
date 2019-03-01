import { expect, assert } from 'chai';
import FilteredlistCore from 'Src/index.js';
import Rxdux from 'Src/rxdux';
import optionsExample from 'Src/options.example.js';
//import Collo from 'Lib/index.min.js';

import Queries from 'Src/apis/queries';
import Workspace from 'Src/apis/workspace';
import Data from 'Src/apis/data';
import Settings from 'Src/apis/settings';
import Filters from 'Src/apis/filters';
import Hooks from 'Src/hooks';

import { __TEST_RUNNER } from 'Src/constants';

describe('The filteredlist-core library', () => {
  let fl;
  beforeEach(function() {
    fl = new FilteredlistCore(optionsExample);
  });

  it('should instantiate', () => expect(fl).to.be.instanceOf(FilteredlistCore));
  it('should instantiate hooks', () => expect(fl.hooks).to.be.instanceOf(Hooks));
  it('should instantiate queries', () => expect(fl.queries).to.be.instanceOf(Queries));
  it('should instantiate workspace', () => expect(fl.workspace).to.be.instanceOf(Workspace));
  it('should instantiate data', () => expect(fl.data).to.be.instanceOf(Data));
  it('should instantiate settings', () => expect(fl.settings).to.be.instanceOf(Settings));
  it('should instantiate filters', () => expect(fl.filters).to.be.instanceOf(Filters));
  it('should instantiate the Rxdux store', () => expect(fl.rxdux).to.be.instanceOf(Rxdux));

  it('should return the options', () => expect(fl.options).to.deep.equal(optionsExample));

  it('should be able to update the Rxdux store', () => {
    fl.rxdux.store$.subscribe(d => {
      if (d.testUpdate) { 
        assert.ok(d.testUpdate, 1234);
      } else {
        expect(d.testUpdate).to.be.undefined;
      }
    });

    fl.rxdux.dispatch({type: __TEST_RUNNER, data: {testUpdate: 1234}});
  });

  it('should expose Hooks methods to the instance prototype', () => 
    Object.keys(new Hooks())
      .forEach(hook => assert.property(fl, hook)));

});

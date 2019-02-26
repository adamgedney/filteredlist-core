import { expect, assert } from 'chai';
import { of } from 'rxjs';
import Rxdux from 'Src/rxdux/index.js';
import optionsExample from 'Src/options.example.js';
import {
  _TEST_
} from 'Src/constants';

describe('The Rxdux Store', () => {
  let rxdux;

  beforeEach(function() {
    rxdux = new Rxdux();
  });

	it('should instantiate', () => expect(rxdux).to.be.instanceOf(Rxdux));

	it('should be a singleton', () => {
    const rxduxInstance = new Rxdux();
    rxdux.instanceCheck = false;
    rxduxInstance.instanceCheck = true;

    // Two checks will doubly ensure a singleton
    expect(rxdux.instanceCheck).to.be.true;
    expect(rxdux).to.deep.equal(rxduxInstance);
  });

  it('should have initial state', () => expect(rxdux.initialState).to.exist);
  it('should have [reducer] function', () => assert.typeOf(rxdux.reducer, 'function'));
  it('reducer should return a new state', () => {
    expect(rxdux.reducer({}, {type: _TEST_, data: {}})).to.eql({})
    expect(rxdux.reducer({}, {type: _TEST_, data: {test: true}})).to.eql({test: true})
  });

  it('should have [dispatch] method', () => assert.typeOf(rxdux.dispatch, 'function'));
  it('dispatch method should update rxdux state', () => {
    rxdux.store$.subscribe(d => {
      if (d.testUpdate) { 
        assert.ok(d.testUpdate, 1234); 
      } else {
        expect(d.testUpdate).to.be.undefined;
      }
    });

    rxdux.dispatch({type: _TEST_, data: {testUpdate: 1234}});
  });
});
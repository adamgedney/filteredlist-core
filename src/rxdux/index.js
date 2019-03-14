import { Subject, BehaviorSubject, of, from } from 'rxjs';
import {pluck} from 'rxjs/operators';
import { createStore } from 'redux';
import reducer from './reducer';
import { __TEST_RUNNER, RESET } from '../constants';
let _instance;
import initialState from  './initialState';

export default class{
  constructor(instance = {}, hooks) {
    this.hooks = hooks;
    this.instance = instance;
    this.state = {};
    this.reducer = reducer(instance.options, this.hooks);
    this.store = createStore(this.reducer);
    this.store$ = new BehaviorSubject(initialState); // Because it's a BehaviorSubject we can do store$.value to get he last emitted value

    // Update the observable store$
    this.store.subscribe( () => {
      const state = this.store.getState();
      this.store$.next(state);
      this.state = state;
    });

    // Singleton
    if (!_instance) { _instance = this; }

    return _instance;
  }

  /**
   * Main dispatcher. Just a proxy to Rx next.
   * Allows an optional selector to be passed to enable a return Observable
   *
   * @param {*} [action={}]
   */
  dispatch(action = {}, selector) {
    this.store.dispatch(action);

    if (selector && selector === 'state') {
      return of(this.state);
    } else if (selector) {
      return this.selector$(selector);
    }
  }

  /**
   * Selector to get branches of the store by key. Rxified version of reselect
   *
   * @param {*} selector
   * @returns
   */
  selector$(selector) {
    const selected$ = new BehaviorSubject(initialState[selector]);
    let lastSelectedState = initialState[selector];

    this.store$
      .pipe(pluck(selector))
      .subscribe(selectedState => {
        if (selectedState !== lastSelectedState) {
          selected$.next(selectedState);
        }

        lastSelectedState = selectedState;
      });

    return selected$;
  }

  /**
   * Reset the store to initial state
   *
   * @returns
   */
  reset() {
    this.store.dispatch({
      type: RESET,
      data: initialState
    });

    this.hooks.onStoreReset$.next({initialState});

    return {...this, initialState};
  }
}
import { Subject, BehaviorSubject } from 'rxjs';
import { startWith, scan } from 'rxjs/operators';
import reducer from './reducer';
import initialState from './initialState';
import { __TEST_RUNNER } from '../constants';
let _instance;

export default class{
  constructor(instance = {}) {
    this.instance = instance;
    this.initialState = initialState;
    this.reducer = reducer(instance.options, instance.hooks);
    this.action$ = new Subject();// BehaviorSubject allows us to subscribe after an event
    this.store$ = this.action$
      .pipe(  
        startWith(this.initialState),
        scan(this.reducer)
      );

    // Singleton
    if (!_instance) { _instance = this; }

    return _instance;
  }

  /** 
   * Main dispatcher. Just a proxy to Rx next 
  */
  dispatch(action) {
    this.action$.next(action);
  }

}
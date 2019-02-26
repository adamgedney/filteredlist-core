import { Subject } from 'rxjs';
import { startWith, scan } from 'rxjs/operators';
import reducer from './reducer';
import { _TEST_ } from '../constants';
let _instance;

// Primary internal options setup
let initialState = {
  _queryObject: {},
  _queryString: '',
  _items: [{id: "adjhfoadfh0q973580qy35", name: 'Bill'}],
  _workspaceItems: [{where: '[PROPNAME ie. id]', is: 'adjhfoadfh0q973580qy35'}],
  _pagination: {cursor: 'adfq35q35', page: 2, skip: 25, take: 25, totalItems: 30000},// if total isn't supplied then it will default to the _items.length
  _loading: false, // Toggled anytime there is a filterchange, and we are waiting for results
  _selectedView: 'REFERENCE TO A VIEW ID',// defaults to the first view
  _uiConfig: {}
};

export default class{
  constructor(instance) {
    this.instance = instance;
    this.initialState = initialState;
    this.reducer = reducer;
    this.action$ = new Subject();
    this.store$ = this.action$
      .pipe(  
        startWith(this.initialState),
        scan(reducer)
      );

    // Singleton
    if (!_instance) {
      _instance = this;
    }

    return _instance;
  }

  dispatch(action) {
    this.action$.next(action);
  }

}
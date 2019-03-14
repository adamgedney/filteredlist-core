import {
  RUN_FILTER,
  RESET_FILTERS
} from '../constants';
import {mergeMap, map, first, tap} from 'rxjs/operators';
import { of, merge, Subject } from 'rxjs';
import {getFilters as _getFilters} from '../utils';

export default class{
  constructor(rxdux, options, instance = {}) {
    this.options = options;
    this.rxdux = rxdux;
    this.hooks = instance.hooks;
    this.views = instance.views;
    this.queries = instance.queries;
    this.data = instance.data;

    this.activateProxyHookSubscriptions();
  }

  /**
  * Private hooks braodcast from the run function in src/apis/filters.run, after Reducer execution
  * The reducer is building the queryObject, filterObject, and queryString for us.
  * This relaceItems callback can be triggered by the host application after it has processed filter data.If they never 
  * call this callback then they need to manually push to the store themselves
  *
  */
  activateProxyHookSubscriptions() {
    const {_onFilterChange$, onFilterChange$, _onPaginationChange$, onPaginationChange$, _onSort$, onSort$, _onFiltersReset$, onFiltersReset$} = this.hooks;

    _onFilterChange$
      .subscribe(({change, state}) => {
        if (change) { //  BehaviorSubjects initialize
          onFilterChange$.next({change, state, 
            replaceItems: ({items, idProp = 'id', totalItems}) => 
              this.data.replaceItems({items, idProp, totalItems})
          })
        }
      });

    _onPaginationChange$
      .subscribe(({change, state}) => {
        if (change) { //  BehaviorSubjects initialize
          onPaginationChange$.next({change, state, 
            replaceItems: ({items, idProp = 'id', totalItems}) => 
              this.data.replaceItems({items, idProp, totalItems})
          })
        }
      });

    _onSort$
      .subscribe(({change, state}) => {
        if (change) { //  BehaviorSubjects initialize
          onSort$.next({change, state, 
            replaceItems: ({items, idProp = 'id', totalItems}) => 
              this.data.replaceItems({items, idProp, totalItems})
          })
        }
      });

    _onFiltersReset$
      .subscribe(({change, state}) => {
        if (change) { //  BehaviorSubjects initialize
          onFiltersReset$.next({change, state, 
            replaceItems: ({items, idProp = 'id', totalItems}) => 
              this.data.replaceItems({items, idProp, totalItems})
          })
        }
      });
  }

  /**
   * Retrieves all the filters in a given view's filtergroup
   *
   * @param {*} request
   * @returns
   */
  getFilters({view, filterGroup}) {
    return this.rxdux.store$
      .pipe(
        // first(),
        mergeMap(state => {
          return of(_getFilters({view, filterGroup, state}));
        })
      )
  }

  /**
   * Returns the sort filter values for a column
   *
   * @param {*} viewId
   * @returns
   */
  getSortFilters(viewId) {
    return this.rxdux.selector$('views')
      .pipe(map(views => 
        views.filter(view => ((viewId ? view.id === viewId : true)))[0].columns
          .map(column => ({ 
            property: column.property, 
            sort: typeof column.sort === 'undefined' ? null : column.sort
          }))
      )); 
  }

  /**
   * Returns the pagination portion of the view
   * example result:   pagination: {cursor: null, skip: 0, take: 25, totalItems: 0},// if total isn't supplied then it will default to the items.length
   *
   * @param {*} viewId
   * @returns
   */
  getPaginationFilters(viewId) {
    return this.rxdux.selector$('views')
      .pipe(map(views => 
        views.filter(view => ((viewId ? view.id === viewId : true)))[0]
          ._pagination
      )); 
  }

  /**
   * Main filter runner
   *
   * @param {*} filterData
   * @param {*} queryString
   * @returns
   */
  run(filterObject = {}) {
    const state$ = this.rxdux.dispatch({
      type: RUN_FILTER,
      data: filterObject
    }, 'state');
    const state = this.rxdux.state;

    this.hooks.onLoadingChange$.next({loading: true, state});
    this.hooks._onFilterChange$.next({change: filterObject, state});

    // Write our query to the url
    if (state.queryString) {
      this.queries._writeQueryStringToUrl(state.queryString, this.options);
    }

    // These _on hooks get picked up by the src/index file in the [initSubscriptions] fn
    if (filterObject.sort) { this.hooks._onSort$.next({change: filterObject, state}); }
    if (filterObject.pagination) { this.hooks._onPaginationChange$.next({change: filterObject, state}); }

    return state$
  }

  /**
   * Reset all filters
   *
   * @returns
   */
  resetFilters() {
    this.rxdux.dispatch({
      type: RESET_FILTERS
    }, 'state');

    const state = this.rxdux.state;
    this.queries.removeQueryStringFromUrl();
    this.hooks._onFiltersReset$.next({change: {}, state});
    this.hooks.onLoadingChange$.next({loading: true});

    return true;
  }
}
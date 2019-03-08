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
    this.queries = instance.queries;
    this.data = instance.data;

    this.initEventListeners();
  }

  initEventListeners() {

    /** THese subscriptions come from the store. 
     * Their return tells us new state has been built 
     * */
    this.hooks._onFilterChange$.subscribe((data) => {
      const {change, state} = data;
      const {queryObject, queryString} = state;

      /** 
       * 1. Write query string to the url
       * 2. register the onFilterChange$ callback to do a replaceData
       * 3. replace data in store
       */
      const history = this.queries._writeQueryStringToUrl(queryString, this.options);
      // console.log("HISTORY ", history);
      /** This callback can be triggered by the host application after it has processed filter data */
      this.hooks.onFiltersChange$.next({change, state, callback: ({items, idProp = 'id', totalCount}) => {
        console.log('filterChange Callback', items, totalCount, idProp);

        // Handle pushing to store for the app developer.
        // If they never call this callback then they needs to manually push to the store themselves
        this.data.replaceItems({items, idProp, totalItems});
      }});
    }); 

    // this.hooks._onFiltersReset$.subscribe(data => {
    //   this.hooks.onFiltersReset$.next(data);
    // }); 

    // this.hooks._onPaginationChange$.subscribe(data => {
    //   this.hooks.onPaginationChange$.next(data);
    // });

    // this.hooks._onSort$.subscribe(data => {
    //   this.hooks.onSort$.next(data);
    // });


  }

  /**
   * Retrieves all the filters in a given view's filtergroup
   *
   * @param {*} request
   * @returns
   */
  getFilters({view,filterGroup}) {
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
   * example result:   pagination: {cursor: null, page: 1, skip: 0, take: 25, totalItems: 0},// if total isn't supplied then it will default to the items.length
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
   * @returns
   */
  run(filterData) {
    const state$ = this.rxdux.dispatch({
      type: RUN_FILTER,
      data: filterData
    }, 'state')
    .pipe(
      first(),
      tap(state => {
        this.hooks.onLoadingChange$.next({loading: true, state});
        // Write our query to the url
        if (state.queryString) {
          this.queries._writeQueryStringToUrl(state.queryString, this.options);
        }

        // console.log('RUN STATE ', state);
        if (filterData.sort) { this.hooks._onSort$.next({view: filterData.view, sort: filterData.sort, state}); }
        if (filterData.pagination) { this.hooks._onPaginationChange$.next({view: filterData.view, pagination: filterData.pagination, state}); }
        if (filterData.filters) { this.hooks._onFilterChange$.next({change: filterData, state}); }
      })
    );

    state$.subscribe(() => {});// ensure a hook run

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
    });

    this.hooks._onFiltersReset$.next({});
    this.hooks.onLoadingChange$.next({loading: true});

    return true;
  }
}
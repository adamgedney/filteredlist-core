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

    this.initEventListeners();
  }

  initEventListeners() {

    /** Private hooks braodcast from the run function, after Reducer execution
     * The reducer is building the queryObject, filterObject, and queryString for us
     * */
    this.hooks._onFilterChange$.subscribe((data) => {
      const {change, state} = data;
      const {queryString} = state;

      /** 
       * 1. Write query string to the url
       * 2. register the onFilterChange$ callback to do a replaceData
       * 3. replace data in store
       */
      this.queries._writeQueryStringToUrl(queryString, this.options);
     
      /** This callback can be triggered by the host application after it has processed filter data */
      this.hooks.onFilterChange$.next({
        change, 
        state, 
        replaceItems: ({items, idProp = 'id', totalItems}) => {

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
   * @param {*} queryString
   * @returns
   */
  run(filterObject = {}) {
    // Sideffect. Build filterquery data and write it to the store
    this.views.selectView(filterObject.view);
    this.queries._writeFilterQueryDataToStore(
      this.queries._makeFilterQueryData({filterObject})
    );

    const state$ = this.rxdux.dispatch({
      type: RUN_FILTER,
      data: filterObject
    }, 'state')
    .pipe(
      first(),
      tap(state => {
        this.hooks.onLoadingChange$.next({loading: true, state});

        // Write our query to the url
        if (state.queryString) {
          this.queries._writeQueryStringToUrl(state.queryString, this.options);
        }

        if (filterObject.sort) { this.hooks._onSort$.next({view: filterObject.view, sort: filterObject.sort, state}); }
        if (filterObject.pagination) { this.hooks._onPaginationChange$.next({view: filterObject.view, pagination: filterObject.pagination, state}); }
        if (filterObject.filters) { this.hooks._onFilterChange$.next({change: filterObject, state}); }
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
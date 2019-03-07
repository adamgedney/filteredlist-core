import {
  RUN_FILTER,
  RESET_FILTERS
} from '../constants';
import {mergeMap, map, first, tap} from 'rxjs/operators';
import { of, merge, Subject } from 'rxjs';

export default class{
  constructor(rxdux, options, instance = {}) {
    this.rxdux = rxdux;
    this.hooks = instance.hooks;
    this.queries = instance.queries;

    this.initEventListeners();
  }

  initEventListeners() {

    /** THese subscriptions come from the store. 
     * Their return tells us new state has been built 
     * */
    this.hooks._onFilterChange$.subscribe((data) => {
      const {change, state, lastState} = data;
      // get filters, Build query object, then string
      this.rxdux.store$
        .subscribe(result => {
          if (result.queryString) {
            console.log('_onFilterChange$ ** ', result);

          }
        })
      // const queryObject = this.queries._makeQueryObject(filters);
      // const queryString = this._makeQueryString(queryObject);

      // console.log('_onFilterChange$ ** ', change, this.queries, queryObject, queryString);

      // this.hooks.onFilterChange$.next({...data, cb: () => {

      // }}); 
      // @TODO this is the callback that needs to be listened to in order to allow push backs from the event
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
    if (filterGroup) {
      return this.rxdux.selector$('views')
        .pipe(
          mergeMap(views => of(
            views.filter(_view => _view.id === view)[0]
              .filterGroups.filter(group => group.id === filterGroup)[0]
                .filters
          ))
        )
    } else {
      return this.rxdux.selector$('views')
        .pipe(
          mergeMap(views => of(
            views.filter(_view => _view.id === view)[0]
              .filterGroups.reduce((acc, group) => {
                return acc.concat(group.filters);
              }, [])
          ))
        )
    }
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
      // first(),
      tap(state => {
        this.hooks.onLoadingChange$.next({loading: true, state});
        console.log('RUN STATE ', state);
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
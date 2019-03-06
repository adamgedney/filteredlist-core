import {
} from '../constants';
import {mergeMap, map} from 'rxjs/operators';
import { of } from 'rxjs';

export default class{
  constructor(rxdux, options, instance) {
    this.rxdux = rxdux;
  }

  /**
   * Retrieves all the filters in a given view's filtergroup
   *
   * @param {*} request
   * @returns
   */
  getFilters({view,filterGroup}) {
    return this.rxdux.selector$('views')
      .pipe(
        mergeMap(views => of(
          views.filter(_view => _view.id === view)[0]
            .filterGroups.filter(group => group.id === filterGroup)[0]
              .filters
        ))
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
}
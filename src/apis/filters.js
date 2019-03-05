import {
} from '../constants';
import {mergeMap, filter} from 'rxjs/operators';
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
}
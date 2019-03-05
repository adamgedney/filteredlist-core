import {
  SET_VIEWS,
  SELECT_VIEW,
  UPDATE_VIEW
} from '../constants';
import {mergeMap, filter} from 'rxjs/operators';
import { of } from 'rxjs';

export default class{
  constructor(rxdux, options, instance) {
    this.rxdux = rxdux;
    this.namespace = 'views';
  }

  /**
   * Get all views
   *
   * @returns
   */
  getViews() {
    return this.rxdux.selector$(this.namespace);
  }

  /**
   * Populates the views array in the store
   *
   * @param {*} views
   * @returns
   */
  setViews(views) {
    return this.rxdux.dispatch({
      type: SET_VIEWS,
      data: {
        views: Array.isArray(views) ? views : [views]
      }
    }, 'views');
  }

  /**
   * Sets the selectedView reference
   *
   * @param {*} id
   * @returns
   */
  selectView(id) {
    return this.rxdux.dispatch({
      type: SELECT_VIEW,
      data: {id}
    }, 'selectedView');
  }

  /**
   * Returns the view object that the selectedView prop in the store references
   *
   * @returns
   */
  getSelectedView() {
    let _selectedView;

    return this.rxdux.selector$('selectedView')
      .pipe(
        mergeMap(selectedView => {
          _selectedView = selectedView;

          return this.rxdux.selector$(this.namespace);
        }),
        mergeMap(views => of(views
          .filter(view => view.id === _selectedView)[0]
        ))
      )
  }

  /**
   * Returns a view object by id
   *
   * @param {*} id
   * @returns
   */
  getViewById(id) {
    return this.rxdux.selector$(this.namespace)
      .pipe(
        mergeMap(views => of(views
          .filter(view => view.id === id)[0]
        ))
      )
  }

  /**
   * Updates a view object in the store
   *
   * @param {*} id
   * @param {*} view
   * @returns
   */
  updateView(id, view) {
    this.rxdux.dispatch({
      type: UPDATE_VIEW,
      data: {id, view}
    });

    return this.getViewById(id);
  }
}
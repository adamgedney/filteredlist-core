import {map} from 'rxjs/operators';
import {
  UPDATE_COLUMN_VISIBILTY,
  SET_ALL_COLUMNS_VISIBLE,
  UNSET_ALL_COLUMNS_VISIBLE
} from '../constants';

export default class{
  constructor(rxdux, options, instance) {
    this.rxdux = rxdux;
  }

  /**
   * Returns the column portion of a view object. Reduces the response to 
   * just an array of property ids and visibility booleans.
   * 
   * If viewId is falsey, the first view in the store's list will be used
   *
   * @param {*} viewId
   * @returns
   */
  getColumnVisibility(viewId) {
    return this.rxdux.selector$('views')
      .pipe(map(views => 
        views.filter(view => ((viewId ? view.id === viewId : true)))[0].columns
          .map(column => ({ property: column.property, visible: !!column.visible }))
      )); 
  }

  /**
   * Takes a view id and some column visibility update data and sends it to the reducer for processing
   *
   * @param {*} id
   * @param {*} updates
   * @returns
   */
  setColumnVisibility(id, updates) {
    this.rxdux.dispatch({
      type: UPDATE_COLUMN_VISIBILTY,
      data: {id, updates}
    });

    return this.getColumnVisibility(id);
  }

  /**
   * Select all for a view's column visibility
   *
   * @param {*} id
   * @returns
   */
  setAllVisible(id) {
    this.rxdux.dispatch({
      type: SET_ALL_COLUMNS_VISIBLE,
      data: {id}
    });

    return this.getColumnVisibility(id);
  }

  /**
   * Desect visible for all columns in a view
   *
   * @param {*} id
   * @returns
   */
  unsetAllVisible(id) {
    this.rxdux.dispatch({
      type: UNSET_ALL_COLUMNS_VISIBLE,
      data: {id}
    });

    return this.getColumnVisibility(id);
  }
}
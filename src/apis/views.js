import {
  SET_VIEWS,
  SELECT_VIEW
} from '../constants';

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
}
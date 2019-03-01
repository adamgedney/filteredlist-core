import {reduce, map} from 'rxjs/operators';
import {
  PUSH_ITEMS_TO_STORE,
  REPLACE_ITEMS_IN_STORE,
  CLEAR_ITEMS_IN_STORE
} from '../constants';

export default class{
  constructor(rxdux, options, instance) {
    this.rxdux = rxdux;
  }

  /**
   * Returns an Observable of the items in the store$.
   * Output transforms the key value stored data back to an array.
   * @returns
   */
  getItems() {
    return this.rxdux.selector$('items')
      .pipe(map((item) => Object.keys(item).map(k => item[k])));
  }

  /**
   * Pushes items into the store
   *
   * @param {*} items
   * @returns
   */
  pushItems(items) {
    this.rxdux.dispatch({
      type: PUSH_ITEMS_TO_STORE,
      data: {items: Array.isArray(items) ? items : [items]}
    });

    return this.getItems(); // use for it's transform pipe
  }

  /**
   * Replaces items in the store
   *
   * @param {*} items
   * @returns
   */
  replaceItems(items) {
    this.rxdux.dispatch({
      type: REPLACE_ITEMS_IN_STORE,
      data: {items: Array.isArray(items) ? items : [items]}
    });

    return this.getItems(); // use for it's transform pipe
  }

  /**
   * Clears all items in the store
   *
   * @returns
   */
  clearItems() {
    this.rxdux.dispatch({
      type: CLEAR_ITEMS_IN_STORE
    });

    return this.getItems(); // use for it's transform pipe
  }
}
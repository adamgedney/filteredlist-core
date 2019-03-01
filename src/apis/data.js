import {reduce, map} from 'rxjs/operators';
import {
  PUSH_ITEMS_TO_STORE,
  REPLACE_ITEMS_IN_STORE,
  CLEAR_ITEMS_IN_STORE,
  UPDATE_ITEM_IN_THE_STORE
} from '../constants';

export default class{
  constructor(rxdux, options, instance) {
    this.rxdux = rxdux;
  }

  /**
   *Converts collection to a key value registry on the prop optionally sepecifiied
   *
   * @param {*} collection
   * @param {string} [idProp='id']
   * @returns
   */
  _transformCollectionToKeyValue(collection, idProp = 'id') {
    return collection.reduce((acc, curr) => {
      acc[curr[idProp]] = curr;

      return acc;
    }, {});
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
   * @param {*} idProp
   * @returns
   */
  pushItems(items, idProp = 'id') {
    this.rxdux.dispatch({
      type: PUSH_ITEMS_TO_STORE,
      data: {
        items: this._transformCollectionToKeyValue(Array.isArray(items) ? items : [items], idProp)
      }
    });

    return this.getItems(); // use for it's transform pipe
  }

  /**
   * Replaces items in the store
   *
   * @param {*} items
   * @param {*} idProp
   * @returns
   */
  replaceItems(items, idProp = 'id') {
    this.rxdux.dispatch({
      type: REPLACE_ITEMS_IN_STORE,
      data: {
        items: this._transformCollectionToKeyValue(Array.isArray(items) ? items : [items], idProp)
      }
    });

    return this.getItems(); // use for it's transform pipe
  }

  /**
   * Updates an item in the store
   *
   * @param {*} item
   * @param {*} idProp
   * @returns
   */
  updateItem(item, idProp = 'id') {
    this.rxdux.dispatch({
      type: UPDATE_ITEM_IN_THE_STORE,
      data: {id: item[idProp], item}
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
import { pluck } from 'rxjs/operators';
import {
  ADD_ITEM_TO_WORKSPACE,
  REMOVE_ITEM_FROM_WORKSPACE,
  CLEAR_WORKSPACE
} from '../constants';

export default class{
  constructor(rxdux, options, instance) {
    this.rxdux = rxdux;
  }

  /**
   *Retrieve the current workspace from the store$
   *
   * @returns
   */
  getWorkspace() {
    return this.rxdux.store$
      .pipe( pluck('workspace') );
  }

  /**
   * Adds an item reference to the workspace in the store$
   *
   * @returns
   */
  addItemToWorkspace(item, idProp = 'id') {
    this.rxdux.dispatch({
      type: ADD_ITEM_TO_WORKSPACE,
      data: {id: item[idProp], item}
    });

    // Enables subscribing to the current event
    return this.getWorkspace();
  }

  /** 
   * Pulls an item out of the workspace by id
   * 
   * @returns
   * */
  removeItemFromWorkspace(id) {
    this.rxdux.dispatch({
      type: REMOVE_ITEM_FROM_WORKSPACE,
      data: {id}
    });

    // Enables subscribing to the current event
    return this.getWorkspace();
  }

  /**
   * Removes all data from the internal workspace
   *
   * @returns
   */
  clearWorkspace() {
    this.rxdux.dispatch({
      type: CLEAR_WORKSPACE
    });

    // Enables subscribing to the current event
    return this.getWorkspace();
  }
}
import initialState from './initialState';
import {
  __TEST_RUNNER,
  ADD_ITEM_TO_WORKSPACE,
  REMOVE_ITEM_FROM_WORKSPACE,
  CLEAR_WORKSPACE,
  UPDATE_QUERY_STRING,
  UPDATE_QUERY_OBJECT,
  PUSH_ITEMS_TO_STORE,
  REPLACE_ITEMS_IN_STORE,
  CLEAR_ITEMS_IN_STORE
} from '../constants';

/** 
 * Curried. Takes the options and hooks, then returns a real reducer; 
 * */
export default (options, hooks) => (state = initialState, action) => {
  let _state = {...state};
  let _data =  action.data;

  switch(action.type) {
    case __TEST_RUNNER: 
      _state = {..._state, ..._data};
      return _state;

    case ADD_ITEM_TO_WORKSPACE: 
      _state.workspace.items[_data.id] = _data.item;
      return _state;

    case REMOVE_ITEM_FROM_WORKSPACE: 
      delete _state.workspace.items[_data.id];
      return _state;

    case CLEAR_WORKSPACE: 
      _state.workspace.items = {};
      return _state;

    case UPDATE_QUERY_STRING:
      _state.queryString = _data.queryString;
      return _state;
    
    case UPDATE_QUERY_OBJECT:
      _state.queryObject = _data.queryObject;
      return _state;
    
    case PUSH_ITEMS_TO_STORE:
      _state.items = {..._state.items, ..._data.items};
      return _state;
    
    case REPLACE_ITEMS_IN_STORE:
      _state.items = _data.items;
      return _state;
    
    case CLEAR_ITEMS_IN_STORE:
      _state.items = {};
      return _state;

    default:
      return _state;
  }
}
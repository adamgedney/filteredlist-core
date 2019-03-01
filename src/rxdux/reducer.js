import initialState from './initialState';
import {
  __TEST_RUNNER,
  ADD_ITEM_TO_WORKSPACE,
  REMOVE_ITEM_FROM_WORKSPACE,
  CLEAR_WORKSPACE,
  UPDATE_QUERY_STRING,
  UPDATE_QUERY_OBJECT
} from '../constants';

/** 
 * Curried. Takes the options and hooks, then returns a real reducer; 
 * */
export default (options, hooks) => (state = initialState, action) => {
  let _state = {...state};
  let _data =  action.data;

  // if (action.type == 'UPDATE_QUERY_STRING') {
    // console.log(action.type, _state, _data, action);

  // }

  switch(action.type) {
    case __TEST_RUNNER: 
      _state = {..._state, ..._data};
      break;

    case ADD_ITEM_TO_WORKSPACE: 
      _state.workspace.items[_data.id] = _data.item;
      break;

    case REMOVE_ITEM_FROM_WORKSPACE: 
      delete _state.workspace.items[_data.id];
      break;

    case UPDATE_QUERY_STRING:
      _state.queryString = _data.queryString;
      return _state;
    
    case UPDATE_QUERY_OBJECT:
      _state.queryObject = _data.queryObject;
      return _state;

    case CLEAR_WORKSPACE: 
      _state.workspace.items = {};
      break;
  }

  return _state;
}
import initialState from './initialState';
import {
  __TEST_RUNNER,
  ADD_ITEM_TO_WORKSPACE,
  REMOVE_ITEM_FROM_WORKSPACE,
  CLEAR_WORKSPACE,
  UPDATE_QUERY_STRING,
  UPDATE_QUERY_OBJECT,
  PUSH_ITEMS_TO_STORE,
  REPLACE_ITEMS,
  CLEAR_ITEMS,
  UPDATE_ITEM,
  SET_VIEWS,
  SELECT_VIEW,
  UPDATE_VIEW,
  UPDATE_COLUMN_VISIBILTY,
  SET_ALL_COLUMNS_VISIBLE,
  UNSET_ALL_COLUMNS_VISIBLE
} from '../constants';
import _merge from 'lodash.merge';

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
    
    case REPLACE_ITEMS:
      _state.items = _data.items;
      return _state;
    
    case UPDATE_ITEM:
      _state.items[_data.id] = Object.assign({}, _state.items[_data.id], _data.item);
      return _state;
    
    case CLEAR_ITEMS:
      _state.items = {}; 
      return _state;

    case SET_VIEWS:
      _state.views = _data.views;
      _state.selectedView = _data.views[0].id; // set selected view as the first item

    case SELECT_VIEW:
      _state.selectedView = _data.id; 
      return _state;

    case UPDATE_VIEW:
      _state.views = _state.views.map(view => {
        if (view.id === _data.id) {
          view = _merge(view, _data.view);
        }

        return view;
      });

      return _state;

    case UPDATE_COLUMN_VISIBILTY:
      const _updates = Array.isArray(_data.updates) ? _data.updates : [_data.updates];
   
      // Input data example: _data.id _data.updates = {property: 'title', visible: false}
      _state.views = _state.views.map(view => {

        // If the view id matches, find & update the column we need to modify
        if (view.id === _data.id) {
          view.columns.map(column => {

            // Loop over & apply the updates if the column properties match
            _updates.forEach(_update => {
              if (column.property === _update.property) {
                column.visible = _update.visible;
              }
            });
            
            return column;
          });
        }

        return view;
      });
      // console.log("STATE ", JSON.stringify(state, null, 2), _data);
      return _state;

    case SET_ALL_COLUMNS_VISIBLE:
      _state.views = _state.views.map(view => {

        // If the view id matches, select all columns visible
        if (view.id === _data.id) {
          view.columns.map(column => {
            column.visible = true;
      
            return column;
          });
        }

        return view;
      });

      return _state;

    case UNSET_ALL_COLUMNS_VISIBLE:
      _state.views = _state.views.map(view => {

        // If the view id matches, select all columns visible
        if (view.id === _data.id) {
          view.columns.map(column => {
            column.visible = false;
      
            return column;
          });
        }

        return view;
      });

      return _state;

    default:
      return _state;
  }
}
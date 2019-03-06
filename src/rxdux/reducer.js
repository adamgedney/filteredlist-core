import initialState from './initialState';
import {
  __TEST_RUNNER,
  RESET,
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
  UNSET_ALL_COLUMNS_VISIBLE,
  RUN_FILTER,
  RESET_FILTERS
} from '../constants';
import _merge from 'lodash.merge';

const paginationDefault = {cursor: null, page: 1, skip: 0, take: 25, totalItems: 0};

/** 
 * Curried. Takes the options and hooks, then returns a real reducer; 
 * */
export default (options, hooks) => (state = initialState, action) => {
  const lastState = state;
  let _state = {...state};
  let _data =  action.data;

  switch(action.type) {
    case __TEST_RUNNER: 
      _state = {..._state, ..._data};
      return _state;

    case RESET: 
      _state = _data;

      hooks.onStoreReset$.next({state, lastState});
      return _state;

    case ADD_ITEM_TO_WORKSPACE: 
      _state.workspace.items[_data.id] = _data.item;

      hooks.onWorkspaceItemAdded$.next({item: _data.item, workspace: _state.workspace, state, lastState});
      return _state;

    case REMOVE_ITEM_FROM_WORKSPACE: 
      delete _state.workspace.items[_data.id];

      hooks.onWorkspaceItemRemoved$.next({item: _data.id, workspace: _state.workspace, state, lastState});
      return _state;

    case CLEAR_WORKSPACE: 
      _state.workspace.items = {};

      hooks.onWorkSpaceCleared$.next({workspace: _state.workspace, state, lastState});
      return _state;

    case UPDATE_QUERY_STRING:
      _state.queryString = _data.queryString;

      hooks.onQueryStringUpdated$.next({queryString: _state.queryString, state, lastState});
      return _state;
    
    case UPDATE_QUERY_OBJECT:
      _state.queryObject = _data.queryObject;

      hooks.onQueryObjectUpdated$.next({queryObject: _state.queryObject, state, lastState});
      return _state;
    
    case PUSH_ITEMS_TO_STORE:
      _state.items = _merge(_state.items, _data.items);
      _state.loading = false;

      // Update item count
      _state.views.map(view => {
        if(view.id === _state.selectedView) {
          view._pagination.totalItems = _data.totalItems || 0;
        }
      });

      hooks.onDataPushed$.next({items: _state.items, state, lastState});
      hooks.onLoadingChange$.next({loading: _state.loading, state, lastState});
      return _state;
    
    case REPLACE_ITEMS:
      _state.items = _data.items;
      _state.loading = false;

      // Update item count
      _state.views.map(view => {
        if(view.id === _state.selectedView) {
          view._pagination.totalItems = _data.totalItems || 0;
        }
      });

      hooks.onDataReplaced$.next({items: _state.items, state, lastState});
      hooks.onLoadingChange$.next({loading: _state.loading, state, lastState});
      return _state;
    
    case UPDATE_ITEM:
      _state.items[_data.id] = Object.assign({}, _state.items[_data.id], _data.item);

      hooks.onItemUpdated$.next({item: _data.item, items: _state.items, state, lastState});
      return _state;
    
    case CLEAR_ITEMS:
      _state.items = {}; 

      // Update item count
      _state.views.map(view => {
        if(view.id === _state.selectedView) {
          view._pagination = paginationDefault;
        }
      });

      hooks.onItemsCleared$.next({items: _state.items, state, lastState});
      return _state;

    case SET_VIEWS:
      // Views must be an array, but we can pass a single view in if we want
      if (!Array.isArray(_data.views)) { _data.views = [_data.views]; }

      // Includes & defaults for views
      _data.views.map(view => {
        if (!view._pagination) { view['_pagination'] = paginationDefault; }
        if (!view.filterGroups) { view['filterGroups'] = []; }
      });

      _state.views = _data.views;
      _state.selectedView = _data.views[0].id; // set selected view as the first item

      hooks.onViewsSet$.next({views: _state.views, state, lastState});
      return _state;

    case SELECT_VIEW:
      _state.selectedView = _data.id; 

      hooks.onSelectedViewChange$.next({selectedView: _state.selectedView, state, lastState});
      return _state;

    case UPDATE_VIEW:
      _state.views = _state.views.map(view => {
        if (view.id === _data.id) {
          view = _merge(view, _data.view);
        }

        return view;
      });

      hooks.onViewUpdated$.next({
        view: _state.views.filter(view => view.id === _data.id)[0], 
        state, lastState
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

      hooks.onColumnVisibilityChange$.next({updates: _data.updates, views: _state.views, state, lastState});
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

      hooks.onColumnVisibilityChange$.next({updates: 'set-all', views: _state.views, state, lastState});
      hooks.onSetAllColumnsVisible$.next({views: _state.views, state, lastState});
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

      hooks.onColumnVisibilityChange$.next({updates: 'unset-all', views: _state.views, state, lastState});
      hooks.onUnsetAllColumnsVisible$.next({views: _state.views, state, lastState});
      return _state;

    case RUN_FILTER:
    // Example full filter command
    // {
    //   view : 'eli',
    //   filters: [{
    //     id: 'newtons',
    //     value: ['f144y'],
    //     operator: null
    //   }],
    //   sort: [{column: 'id', operator: 'DESC'}],
    //   pagination: {skip: 1, take: 25}
    // }

      _state.views = _state.views.map(view => {
        if (view.id === _data.view) { // view specific filter runs

          /** FILTERING */
          if (_data.filters) {
            _data.filters.forEach(filterCmd => {
              view.filterGroups.map(group => {
                group.filters.map(filter => {
                  if (filter.id === filterCmd.id) {

                    // All filter values should be an array, for consistency.
                    // We can handle translation on output
                    if (!Array.isArray(filterCmd.value)) {
                      filterCmd.value  = [filterCmd.value];
                    }

                    filter = _merge(filter, filterCmd);

                    hooks.onFilterChange$.next({change: _data, state, lastState});
                  }

                  return filter;
                })

                return group;
              })
            });
          }

          /** SORT FILTER */
          if (_data.sort) {
            view.columns.map(column => {
              if (column.id === _data.sort.column) {
                column.sort = _data.sort.operator;

                hooks.onSort$.next({view: view.id, sort: _data.sort, state, lastState});
              }

              return column;
            });
          }

          /** PAGINATION FILTER */
          if (_data.pagination) {
            view._pagination = _merge(view._pagination, _data.pagination);
            hooks.onPaginationChange$.next({view: view.id, pagination: view._pagination, state, lastState});
          }
        }

        return view;
      });

      _state.loading = true;
      hooks.onLoadingChange$.next({loading: _state.loading, state, lastState});

      return _state;

    case RESET_FILTERS:
      _state.views = _state.views.map(view => {

        /** FILTERING */
        view.filterGroups.map(group => {
          group.filters.map(filter => {
            filter['value']  = null;
            filter['operator'] = null;

            return filter;
          });

          return group;
        })

        /** SORT FILTER */
        view.columns.map(column => {
          column['sort'] = null;
          
          return column;
        });

        /** PAGINATION FILTER */
        view['_pagination'] = paginationDefault;

        return view;
      });
     
      _state.loading = true;

      hooks.onFiltersReset$.next({state, lastState});
      hooks.onLoadingChange$.next({loading: _state.loading, state, lastState});
      return _state;

    default:
      return _state;
  }
}

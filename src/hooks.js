import {Subject, BehaviorSubject} from 'rxjs';

let _instance;

export default class{
  /**  
     * @examples
     * fl.onFilterChange$.subscribe(() => {});
     * fl.onFilterChange$.next();
     */
    onFilterChange$ = new BehaviorSubject({});
    
        /**   
     * @examples
     * fl.onFiltersReset$.subscribe() => {});
     */
    onFiltersReset$ = new BehaviorSubject({});

        /**   
     * @examples
     * fl.onPaginationChange$.subscribe() => {});
     */
    onPaginationChange$ = new BehaviorSubject({});
    
    /**   
     * @examples
     * fl.onSort$.subscribe() => {});
     */
    onSort$ = new BehaviorSubject({});

    /**  
     * @examples
     * fl.onFilterChange$.subscribe(() => {});
     * fl.onFilterChange$.next();
     */
    _onFilterChange$ = new BehaviorSubject({});
    
        /**   
     * @examples
     * fl.onFiltersReset$.subscribe() => {});
     */
    _onFiltersReset$ = new BehaviorSubject({});

        /**   
     * @examples
     * fl.onPaginationChange$.subscribe() => {});
     */
    _onPaginationChange$ = new BehaviorSubject({});
    
    /**   
     * @examples
     * fl.onSort$.subscribe() => {});
     */
    _onSort$ = new BehaviorSubject({});

    /**   
     * @examples
     * fl.onWorkspaceItemAdded$.subscribe() => {});
     */
    onWorkspaceItemAdded$ = new Subject();
    
    /**   
     * @examples
     * fl.onWorkspaceItemRemoved$.subscribe() => {});
     */
    onWorkspaceItemRemoved$ = new Subject();
    
    /**   
     * @examples
     * fl.onWorkSpaceCleared$.subscribe() => {});
     */
    onWorkSpaceCleared$ = new Subject();

    /**
     * When the store reset comes through
     *
     */
    onStoreReset$ = new Subject();
    
    /**   
     * @examples
     * fl.onLoadingChange$.subscribe() => {});
     */
    onLoadingChange$ = new Subject();
    
    /**   
     * @examples
     * fl.onColumnVisibilityChange$.subscribe() => {});
     */
    onColumnVisibilityChange$ = new Subject();
    onSetAllColumnsVisible$ = new Subject();
    onUnsetAllColumnsVisible$ = new Subject();

    /**
     * @examples
     * fl.onDataPushed$.subscribe() => {});
     *
     */
    onDataPushed$ = new Subject();

    /**
     * mostly used internally to detect store changes
     *
     */
    onQueryStringUpdated$ = new Subject();
    onQueryObjectUpdated$ = new Subject();
    onFilterObjectUpdated$ = new Subject();

    onDataReplaced$ = new Subject();
    onItemUpdated$ = new Subject();
    onItemsCleared$ = new Subject();
    onViewsSet$ = new Subject();
    onSelectedViewChange$ = new BehaviorSubject({});
    _onSelectedViewChange$ = new BehaviorSubject({});
    onViewUpdated$ = new Subject();

    constructor() {

      // Singleton
      if (!_instance) { _instance = this; }

      return _instance;
    }

    // /**
    //  * Main entry point for hook runs
    //  *
    //  * @param {*} type
    //  * @param {*} data
    //  * @returns
    //  */
    // hook(type, data) {
    //   const hook$ = this[type];

    //   hook$.next(data);
    //   this.onChange$.next({...data, type});

    //   return hook$;
    // }
}
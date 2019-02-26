import {Subject} from 'rxjs';

export default class{
  constructor() {
    this.setupHooks();
  }

  setupHooks() {
    /**  
     * @examples
     * fl.onFilterChange$.subscribe(({filterId, filterValue, queryObject, cb}) => {});
     * fl.onFilterChange$.next({filterId, filterValue, queryObject, cb});
     */
    this.onFilterChange$ = new Subject();
    
    /**   
     * @examples
     * fl.onFilterAdded$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    this.onFilterAdded$ = new Subject();
    
    /**   
     * @examples
     * fl.onFilterRemoved$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    this.onFilterRemoved$ = new Subject();
    
    /**   
     * @examples
     * fl.onWorkspaceItemAdded$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    this.onWorkspaceItemAdded$ = new Subject();
    
    /**   
     * @examples
     * fl.onWorkspaceItemRemoved$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    this.onWorkspaceItemRemoved$ = new Subject();
    
    /**   
     * @examples
     * fl.onWorkSpaceCleared$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    this.onWorkSpaceCleared$ = new Subject();
    
    /**   
     * @examples
     * fl.onFiltersReset$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    this.onFiltersReset$ = new Subject();
    
    /**   
     * @examples
     * fl.onPaginationChange$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    this.onPaginationChange$ = new Subject();
    
    /**   
     * @examples
     * fl.onSort$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    this.onSort$ = new Subject();
    
    /**   
     * @examples
     * fl.loading$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    this.loading$ = new Subject();
    
    /**   
     * @examples
     * fl.onColumnVisibilityChange$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    this.onColumnVisibilityChange$ = new Subject();
    
  }

}
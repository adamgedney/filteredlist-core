import {Subject} from 'rxjs';

export default class{
  /**  
     * @examples
     * fl.onFilterChange$.subscribe(({filterId, filterValue, queryObject, cb}) => {});
     * fl.onFilterChange$.next({filterId, filterValue, queryObject, cb});
     */
    onFilterChange$ = new Subject();
    
    /**   
     * @examples
     * fl.onFilterAdded$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    onFilterAdded$ = new Subject();
    
    /**   
     * @examples
     * fl.onFilterRemoved$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    onFilterRemoved$ = new Subject();
    
    /**   
     * @examples
     * fl.onWorkspaceItemAdded$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    onWorkspaceItemAdded$ = new Subject();
    
    /**   
     * @examples
     * fl.onWorkspaceItemRemoved$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    onWorkspaceItemRemoved$ = new Subject();
    
    /**   
     * @examples
     * fl.onWorkSpaceCleared$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    onWorkSpaceCleared$ = new Subject();
    
    /**   
     * @examples
     * fl.onFiltersReset$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    onFiltersReset$ = new Subject();
    
    /**   
     * @examples
     * fl.onPaginationChange$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    onPaginationChange$ = new Subject();
    
    /**   
     * @examples
     * fl.onSort$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    onSort$ = new Subject();
    
    /**   
     * @examples
     * fl.loading$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    loading$ = new Subject();
    
    /**   
     * @examples
     * fl.onColumnVisibilityChange$.subscribe((filterId, filterValue, queryObject, cb) => {});
     */
    onColumnVisibilityChange$ = new Subject();
}
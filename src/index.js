import Rxdux from './rxdux';
import Data from './apis/data';
import Filters from './apis/filters';
import Views from './apis/views';
import Queries from './apis/queries';
import Settings from './apis/settings';
import Workspace from './apis/workspace';
import Hooks from './hooks';


export default class{
  constructor(options) {
    this.options = options; //  @todo add options schema validation in the future
    
    /** 
     * Need access to this.options and there is a preference in order of instantiation 
     * so we need this setup procedure 
    */
    this.hooks = this._setupHooks();
    this.rxdux = new Rxdux(this, this.hooks); 
    this.queries = new Queries(this.rxdux, this.options, this);
    this.workspace = new Workspace(this.rxdux, this.options, this); 
    this.settings = new Settings(this.rxdux, this.options, this); 
    this.data = new Data(this.rxdux, this.options, this); 
    this.filters = new Filters(this.rxdux, this.options, this);
    this.views = new Views(this.rxdux, this.options, this);

    this._onPageLoad();
  }

  /**
   * Instantiates hoks, and flattens them down to the instance prototype
   *
   * @returns {}
   */
  _setupHooks() {
    const hooks = new Hooks();

    /** Flatten */
    Object.keys(hooks)
      .forEach(hookName => {
        this[hookName] = hooks[hookName];
      });

    return hooks;
  }

  /**
   * Setup page load listeners to handle query string processing
   *
   */
  _onPageLoad(){
  //   if (document.readyState == "complete") {
  //     alert("Your page is loaded");
  // }
  // Return Value: A String, representing the status of the current document.
  
  // One of five values:
  
  // uninitialized - Has not started loading yet
  // loading - Is loading
  // loaded - Has been loaded
  // interactive - Has loaded enough and the user can interact with it
  // complete - Fully loaded
  }

  /**
   * Main procedures for building query objects and query strings
   *
   */
  _onFilterChange() {
    //onFilterChange$, onSort$, onPaginationChange$ 

    // onLoading Change start can be our trigger to build the query string and object.
  }
}
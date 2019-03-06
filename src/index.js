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
}
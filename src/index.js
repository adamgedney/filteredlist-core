import Rxdux from './rxdux';
import Data from './apis/data';
import Filters from './apis/filters';
import Queries from './apis/queries';
import Workspace from './apis/workspace';


export default class{
  constructor(optionsExample) {
    this.options = optionsExample;
    
    this.setupInstances();
  }

  setupInstances() {
    this.rxdux = new Rxdux(this); 
    this.queries = new Queries(this.rxdux, this.options, this);
    this.workspace = new Workspace(this.rxdux, this.options, this); 
    this.data = new Data(this.rxdux, this.options, this); 
    this.filters = new Filters(this.rxdux, this.options, this);
  }
}
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
    this.rxdux = new Rxdux(); 
    this.queries = new Queries();
    this.workspace = new Workspace(); 
    this.data = new Data(); 
    this.filters = new Filters(); 
  }
}
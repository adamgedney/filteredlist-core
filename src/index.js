import Rxdux from './rxdux';

export default class{
  constructor(optionsExample) {
    this.options = optionsExample;
    this.rxdux = new Rxdux();
    
  }
}
import {
  _TEST_
} from '../constants';

/** 
 * Curried. Takes the options and hooks, then returns a real reducer; 
 * */
export default (options, hooks) => (state = {}, action) => {
  switch(action.type) {
    case '_TEST_': 
      return {...state, ...action.data};
    default:
      return state;
  }
}
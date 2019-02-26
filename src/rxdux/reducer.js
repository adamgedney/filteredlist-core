import {
  __TEST_RUNNER
} from '../constants';

/** 
 * Curried. Takes the options and hooks, then returns a real reducer; 
 * */
export default (options, hooks) => (state = {}, action) => {
  switch(action.type) {
    case __TEST_RUNNER: 
      return {...state, ...action.data};
    default:
      return state;
  }
}
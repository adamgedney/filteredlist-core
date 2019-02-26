import {
  _TEST_
} from '../constants';

export default (state = {}, action) => {
  switch(action.type) {
    case '_TEST_': 
      return {...state, ...action.data};
    default:
      return state;
  }
}
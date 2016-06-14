import {SET_STATE} from '../constants/app.js';

console.log(SET_STATE);

export function setAppState(state) {

console.log('ACTIONS', state)

  return {
    type: SET_STATE,
    state
  }
};

import {SET_STATE} from '../constants/app.js';

const initialState = {
  appState: ''
};

const appState = (state = initialState, action) => {

    switch (action.type) {

        case SET_STATE:
            return Object.assign(state, {
              appState: action.appState
            });
            break;
        default:
            return state;

    }

}

export default appState;

import {SET_STATE} from 'constants/app.js';

const initialState = {
  appState: 'GO GO GO'
};

export default function appState(state = initialState, action) => {

  console.log('APP STATE', action);

    switch (action.type) {

        case SET_STATE:

            return Object.assign(state, {
              appState: "TEST"
            });

        default:
            return state;

    }

}

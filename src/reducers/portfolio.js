import {
    SET_STATE
} from '../constants/app.js';

const initialState = {
    state: '',
    id: -1
};

export default function(state = initialState, action) {

    switch (action.type) {

        case SET_STATE:

            return Object.assign({}, state, {
                state: action.state,
                id: action.id || -1
            });

        default:

            return state;

    }

}

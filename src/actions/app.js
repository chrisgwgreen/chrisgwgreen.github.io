import {
    SET_STATE
} from '../constants/app.js';

export function setAppState(action) {
    return {
        type: SET_STATE,
        state: action.state,
        id: action.id
    }
};

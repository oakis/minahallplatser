import {
    GET_SETTINGS,
    SET_SETTING
} from '../actions/types';

const INIT_STATE = {
    timeFormat: 'minutes'
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_SETTINGS:
        case SET_SETTING:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};  

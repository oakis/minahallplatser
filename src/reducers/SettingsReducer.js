import {
    GET_SETTINGS,
    SET_SETTING
} from '../actions/types';

const INIT_STATE = {
    timeFormat: 'minutes'
};

export default (state = INIT_STATE, action) => {
    console.log(action);
    switch (action.type) {
        case GET_SETTINGS:
            console.log(state);
            return { ...state };
        case SET_SETTING:
            console.log({ ...state, ...action.payload });
            return { ...state, ...action.payload };
        default:
            return state;
    }
};  

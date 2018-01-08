import {
    ERROR,
    CLR_ERROR,
    RESET_ALL
} from '../actions/types';

const INIT_STATE = {
    error: ''
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case ERROR:
            return { ...state, error: action.payload };
        case CLR_ERROR:
            return { ...state, error: '' };
        case RESET_ALL:
            return { ...INIT_STATE };
        default:
            return state;
    }
};  

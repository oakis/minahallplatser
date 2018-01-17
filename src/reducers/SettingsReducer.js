import {
    SET_SETTING,
    RESET_ALL
} from '../actions/types';

const INIT_STATE = {
    timeFormat: 'minutes',
    favoriteOrder: 'nothing',
    allowedGPS: true,
    hasUsedGPS: false,
    anonFirstAppStart: true
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case SET_SETTING:
            return { ...state, ...action.payload };
        case RESET_ALL:
			return { ...INIT_STATE };
        default:
            return state;
    }
};  

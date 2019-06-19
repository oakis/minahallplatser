import {
    SET_SETTING,
} from '../actions/types';

const INIT_STATE = {
    timeFormat: 'minutes',
    favoriteOrder: 'nothing',
    allowedGPS: true,
    hasUsedGPS: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case SET_SETTING:
            return {
                ...state,
                [action.payload.type]: action.payload.value,
            };
        default:
            return state;
    }
};

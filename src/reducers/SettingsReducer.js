import {SET_SETTING, ALLOWED_GPS} from '@types';

const INIT_STATE = {
  timeFormat: 'minutes',
  favoriteOrder: undefined,
  allowedGPS: false,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_SETTING:
      return {
        ...state,
        [action.payload.type]: action.payload.value,
      };
    case ALLOWED_GPS:
      return {
        ...state,
        allowedGPS: action.payload,
      };
    default:
      return state;
  }
};

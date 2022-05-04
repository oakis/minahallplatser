import {SET_SETTING} from '@types';

export const setSetting = (type, value) => {
  return dispatch => {
    dispatch({
      type: SET_SETTING,
      payload: {
        type,
        value,
      },
    });
  };
};

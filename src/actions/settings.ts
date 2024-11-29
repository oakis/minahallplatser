import {SET_SETTING} from '@types';
import {Dispatch} from 'redux';

export const setSetting = (type: string, value: string) => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: SET_SETTING,
      payload: {
        type,
        value,
      },
    });
  };
};

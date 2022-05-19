import {CLR_ERROR} from '@types';
import {Dispatch} from 'redux';

export const clearErrors = () => {
  return (dispatch: Dispatch) => {
    return new Promise(resolve => resolve(dispatch({type: CLR_ERROR})));
  };
};

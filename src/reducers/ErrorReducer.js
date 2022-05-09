import {ERROR, CLR_ERROR} from '@types';

const INIT_STATE = {
  error: '',
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case ERROR:
      return {...state, error: action.payload};
    case CLR_ERROR:
      return {...state, error: ''};
    default:
      return state;
  }
};

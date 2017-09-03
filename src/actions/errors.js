import { CLR_ERROR } from './types';

export const clearErrors = () => {
    return (dispatch) => {
        return new Promise((resolve) => resolve(dispatch({ type: CLR_ERROR })));
    };
};

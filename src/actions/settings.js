import { getStorage, setStorage } from '../components/helpers';
import { SET_SETTING } from './types';
import { store } from '../App';

export const getSettings = (dispatch) => {
    return getStorage('minahallplatser-settings')
        .then((settings) => {
            dispatch({ type: SET_SETTING, payload: settings });
        });
};

export const setSetting = (type, value) => {
    return (dispatch) => {
        const { settings } = store.getState();
        settings[type] = value;
        dispatch({ type: SET_SETTING, payload: settings });
        setStorage('minahallplatser-settings', settings)
            .then(() => window.log('Settings updated.'))
            .catch((e) => window.log('error', e));
    };
};

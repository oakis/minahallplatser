import { getStorage, setStorage } from '../components/helpers';
import { SET_SETTING } from './types';

export const getSettings = (dispatch) => {
    return getStorage('minahallplatser-settings')
        .then((settings) => {
            dispatch({ type: SET_SETTING, payload: settings });
        });
};

export const setSetting = (type, value) => {
    return (dispatch) => {
        getStorage('minahallplatser-settings')
        .then((data) => {
            const settings = data || {};
            settings[type] = value;
            dispatch({ type: SET_SETTING, payload: settings });
            setStorage('minahallplatser-settings', settings)
                .then(() => window.log('Settings updated.'))
                .catch((e) => window.log('error', e));
        })
        .catch(e => window.log('error', e));
    };
};

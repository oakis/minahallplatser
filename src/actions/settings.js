import { SET_SETTING } from './types';
import { AsyncStorage } from 'react-native';

export const getSettings = () => {
    return (dispatch) => {
        AsyncStorage.getItem('minahallplatser-settings').then((dataJson) => {
            const settings = JSON.parse(dataJson);
            dispatch({ type: SET_SETTING, payload: settings });
        });
    };
};

export const setSetting = (type, value) => {
    return (dispatch) => {
        AsyncStorage.getItem('minahallplatser-settings').then((dataJson) => {
            const settings = JSON.parse(dataJson) || {};
            settings[type] = value;
            AsyncStorage.setItem('minahallplatser-settings', JSON.stringify(settings))
            .then(() => dispatch({ type: SET_SETTING, payload: settings }))
            .catch((e) => window.log('error', e));
        })
        .catch(e => window.log('error', e));
    };
};

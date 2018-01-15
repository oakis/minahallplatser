import { AsyncStorage } from 'react-native';
import { SET_SETTING } from './types';

export const getSettings = (dispatch) => {
    return new Promise((resolve) => {
        AsyncStorage.getItem('minahallplatser-settings').then((dataJson) => {
            const settings = JSON.parse(dataJson);
            window.log('getSettings():', settings);
            resolve(dispatch({ type: SET_SETTING, payload: settings }));
        });
    });
};

export const setSetting = (type, value) => {
    return (dispatch) => {
        AsyncStorage.getItem('minahallplatser-settings').then((dataJson) => {
            const settings = JSON.parse(dataJson) || {};
            settings[type] = value;
            window.log('setSetting:', settings[type]);
            dispatch({ type: SET_SETTING, payload: settings });
            AsyncStorage.setItem('minahallplatser-settings', JSON.stringify(settings))
            .then(() => window.log('Settings updated.'))
            .catch((e) => window.log('error', e));
        })
        .catch(e => window.log('error', e));
    };
};

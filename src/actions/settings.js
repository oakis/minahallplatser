import { GET_SETTINGS, SET_SETTING } from './types';
import { AsyncStorage } from 'react-native';

export const getSettings = () => {
    console.log('getSettings');
    return (dispatch) => {
        AsyncStorage.getItem('minahallplatser-settings').then((dataJson) => {
            const settings = JSON.parse(dataJson);
            dispatch({ type: SET_SETTINGS, payload: settings });
        });
    };
};

export const setSetting = (type, value) => {
    console.log('setSetting', type, value);
    return (dispatch) => {
        AsyncStorage.getItem('minahallplatser-settings').then((dataJson) => {
            const settings = JSON.parse(dataJson) || {};
            settings[type] = value;
            console.log(settings);
            AsyncStorage.setItem('minahallplatser-settings', JSON.stringify(settings))
            .then(() => dispatch({ type: SET_SETTING, payload: settings }))
            .catch((e) => console.log('error', e));
        })
        .catch(e => console.log('error', e));
    };
};

import { Platform } from 'react-native';
import { getModel, getSystemVersion, getVersion } from 'react-native-device-info';

export const isAndroid = () => {
    return Platform.OS === 'android';
};

export const isIOS = () => {
    return Platform.OS === 'ios';
};

export const getDeviceModel = () => {
    return getModel();
};

export const getOsVersion = () => {
    return getSystemVersion();
};

export const getAppVersion = () => {
    return getVersion();
};
